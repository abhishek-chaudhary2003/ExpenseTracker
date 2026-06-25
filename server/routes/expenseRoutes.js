import { Router } from "express";
import {
  getAllExpenses,
  getSummary,
  exportCSV,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = Router();

router.get("/summary", getSummary);
router.get("/export.csv", exportCSV);

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
