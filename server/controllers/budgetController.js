import { readBudgets, writeBudgets } from "../db/budgets.js";
import { readAll } from "../db/expenses.js";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export async function getAllBudgets(req, res) {
  const budgets = await readBudgets();
  const expenses = await readAll();

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const result = CATEGORIES.map((category) => {
    const budget = budgets.find((b) => b.category === category) ?? null;
    const spent = expenses
      .filter((e) => e.category === category && e.date.startsWith(ym))
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      category,
      limit: budget?.limit ?? null, // null means no budget set
      spent,
      remaining: budget ? budget.limit - spent : null,
      isOverBudget: budget ? spent > budget.limit : false,
    };
  });

  res.json({ data: result });
}

export async function setBudget(req, res) {
  const { category } = req.params;

  if (!CATEGORIES.includes(category))
    return res
      .status(400)
      .json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });

  const limit = parseFloat(req.body.limit);
  if (isNaN(limit) || limit <= 0)
    return res.status(400).json({ error: "limit must be a positive number" });

  const budgets = await readBudgets();
  const index = budgets.findIndex((b) => b.category === category);

  if (index !== -1) {
    budgets[index] = {
      ...budgets[index],
      limit,
      updatedAt: new Date().toISOString(),
    };
  } else {
    budgets.push({ category, limit, createdAt: new Date().toISOString() });
  }

  await writeBudgets(budgets);

  res.json({ data: { category, limit } });
}

export async function deleteBudget(req, res) {
  const { category } = req.params;

  const budgets = await readBudgets();
  const index = budgets.findIndex((b) => b.category === category);

  if (index === -1)
    return res.status(404).json({ error: "No budget set for this category" });

  budgets.splice(index, 1);
  await writeBudgets(budgets);

  res.status(204).send();
}
