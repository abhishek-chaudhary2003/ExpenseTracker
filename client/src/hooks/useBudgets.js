import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgets, setBudget, deleteBudget } from "../lib/api.js";
import { toast } from "sonner";

export const BUDGET_KEY = ["budgets"];

export function useBudgets() {
  return useQuery({
    queryKey: BUDGET_KEY,
    queryFn: getBudgets,
    staleTime: 30_000,
  });
}

export function useSetBudget() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: setBudget,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUDGET_KEY });
      toast.success("Budget updated successfully");
    },

    onError: () => {
      toast.error("Failed to update budget");
    },
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BUDGET_KEY });
      toast.success("Budget deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete budget");
    },
  });
}