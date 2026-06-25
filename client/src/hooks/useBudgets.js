import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgets, setBudget, deleteBudget } from "../lib/api.js";

export const BUDGET_KEY = ["budgets"];

export function useBudgets() {
  return useQuery({
    queryKey: BUDGET_KEY,
    queryFn:  getBudgets,
    staleTime: 30_000,
  });
}

export function useSetBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setBudget,
    onSuccess:  () => qc.invalidateQueries({ queryKey: BUDGET_KEY }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess:  () => qc.invalidateQueries({ queryKey: BUDGET_KEY }),
  });
}
