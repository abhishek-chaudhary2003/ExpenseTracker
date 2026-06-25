import express from "express";
import cors from "cors";
import { initDB } from "./db/expenses.js";
import { initBudgetDB } from "./db/budgets.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

await initDB();
await initBudgetDB();
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));

export default app;
