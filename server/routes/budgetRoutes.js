import { Router } from "express";
import {
  getAllBudgets,
  setBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

const router = Router();

router.get("/", getAllBudgets);
router.put("/:category", setBudget);
router.delete("/:category", deleteBudget);

export default router;
