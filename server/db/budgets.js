import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "budgets.json",
);

export async function initBudgetDB() {
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]");
    console.log("Created budgets.json");
  }
  console.log("Budget DB ready →", FILE);
}

export async function readBudgets() {
  const raw = await fs.readFile(FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeBudgets(budgets) {
  await fs.writeFile(FILE, JSON.stringify(budgets, null, 2));
}
