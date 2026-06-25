import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } from "../lib/api.js";

export const KEYS = {
  expenses: (f) => ["expenses", f],
  summary:  ()  => ["summary"],
};

export function useExpenses(filters) {
  return useQuery({
    queryKey: KEYS.expenses(filters),
    queryFn:  () => getExpenses(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useSummary() {
  return useQuery({
    queryKey: KEYS.summary(),
    queryFn:  getSummary,
    staleTime: 30_000,
  });
}

function invalidateAll(qc) {
  qc.invalidateQueries({ queryKey: ["expenses"] });
  qc.invalidateQueries({ queryKey: ["summary"] });
  qc.invalidateQueries({ queryKey: ["budgets"] });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess:  () => invalidateAll(qc),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["expenses"] });
      const snap = qc.getQueriesData({ queryKey: ["expenses"] });
      qc.setQueriesData({ queryKey: ["expenses"] }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map((e) => e.id === updated.id ? { ...e, ...updated } : e) };
      });
      return { snap };
    },
    onError: (_e, _v, ctx) => {
      ctx?.snap?.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => invalidateAll(qc),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["expenses"] });
      const snap = qc.getQueriesData({ queryKey: ["expenses"] });
      qc.setQueriesData({ queryKey: ["expenses"] }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.filter((e) => e.id !== id), total: old.total - 1 };
      });
      return { snap };
    },
    onError: (_e, _v, ctx) => {
      ctx?.snap?.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => invalidateAll(qc),
  });
}
