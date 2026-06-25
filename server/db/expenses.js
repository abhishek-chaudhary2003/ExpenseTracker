import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "expenses.json",
);

export async function initDB() {
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]");
    console.log("Created expenses.json");
  }
  console.log("DB ready →", FILE);
}

export async function readAll() {
  const raw = await fs.readFile(FILE, "utf-8");
  return JSON.parse(raw);
}

export async function writeAll(expenses) {
  await fs.writeFile(FILE, JSON.stringify(expenses, null, 2));
}
