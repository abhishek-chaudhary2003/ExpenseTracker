import { v4 as uuid } from "uuid";
import { readAll, writeAll } from "../db/expenses.js";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];
const today = () => new Date().toISOString().split("T")[0];

function validate(body, partial = false) {
  const errors = [];

  if (!partial || body.amount !== undefined) {
    const n = parseFloat(body.amount);
    if (isNaN(n) || n <= 0) errors.push("amount must be a positive number");
  }

  if (!partial || body.category !== undefined) {
    if (!CATEGORIES.includes(body.category))
      errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  }

  if (!partial || body.date !== undefined) {
    if (!body.date || isNaN(Date.parse(body.date)))
      errors.push("date is invalid");
    else if (body.date > today()) errors.push("date cannot be in the future");
  }

  return errors;
}

export async function getAllExpenses(req, res) {
  const { category, startDate, endDate, sortBy = "date" } = req.query;

  let list = await readAll();

  if (category && category !== "All")
    list = list.filter((e) => e.category === category);

  if (startDate) list = list.filter((e) => e.date >= startDate);

  if (endDate) list = list.filter((e) => e.date <= endDate);

  if (sortBy === "amount") list.sort((a, b) => b.amount - a.amount);
  else if (sortBy === "category")
    list.sort((a, b) => a.category.localeCompare(b.category));
  else list.sort((a, b) => (b.date > a.date ? 1 : -1));

  res.json({ data: list, total: list.length });
}

export async function getSummary(req, res) {
  const all = await readAll();

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const thisMonth = all.filter((e) => e.date.startsWith(ym));
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    total: all
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  const highest = all.length
    ? all.reduce((max, e) => (e.amount > max.amount ? e : max))
    : null;

  res.json({
    totalThisMonth,
    thisMonthCount: thisMonth.length,
    byCategory,
    highest,
  });
}

export async function exportCSV(req, res) {
  const { category, startDate, endDate } = req.query;
  let list = await readAll();

  if (category && category !== "All")
    list = list.filter((e) => e.category === category);
  if (startDate) list = list.filter((e) => e.date >= startDate);
  if (endDate) list = list.filter((e) => e.date <= endDate);

  const header = "id,amount,category,date,note";
  const rows = list.map(
    (e) =>
      `${e.id},${e.amount},${e.category},${e.date},"${(e.note ?? "").replace(/"/g, '""')}"`,
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
  res.send([header, ...rows].join("\n"));
}

export async function getExpenseById(req, res) {
  const all = await readAll();
  const expense = all.find((e) => e.id === req.params.id);

  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.json({ data: expense });
}

export async function createExpense(req, res) {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const expense = {
    id: uuid(),
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    note: req.body.note?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };

  const all = await readAll();
  all.unshift(expense); // newest first
  await writeAll(all);

  res.status(201).json({ data: expense });
}

export async function updateExpense(req, res) {
  const errors = validate(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const all = await readAll();
  const index = all.findIndex((e) => e.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Expense not found" });

  const changes = {};
  if (req.body.amount !== undefined)
    changes.amount = parseFloat(req.body.amount);
  if (req.body.category !== undefined) changes.category = req.body.category;
  if (req.body.date !== undefined) changes.date = req.body.date;
  if (req.body.note !== undefined) changes.note = req.body.note.trim();
  changes.updatedAt = new Date().toISOString();

  all[index] = { ...all[index], ...changes };
  await writeAll(all);

  res.json({ data: all[index] });
}

export async function deleteExpense(req, res) {
  const all = await readAll();
  const index = all.findIndex((e) => e.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Expense not found" });

  all.splice(index, 1);
  await writeAll(all);

  res.status(204).send();
}
