import axios from "axios";

const http = axios.create({ baseURL: "/api", timeout: 8000 });

export const getExpenses  = (params) => http.get("/expenses", { params }).then(r => r.data);
export const getSummary   = ()       => http.get("/expenses/summary").then(r => r.data);
export const createExpense= (data)   => http.post("/expenses", data).then(r => r.data.data);
export const updateExpense= ({id, ...data}) => http.patch(`/expenses/${id}`, data).then(r => r.data.data);
export const deleteExpense= (id)     => http.delete(`/expenses/${id}`);

export const csvDownloadUrl = (params) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  return `/api/expenses/export.csv${qs ? `?${qs}` : ""}`;
};

export const getBudgets   = ()               => http.get("/budgets").then(r => r.data.data);
export const setBudget    = ({category, limit}) => http.put(`/budgets/${category}`, { limit }).then(r => r.data.data);
export const deleteBudget = (category)       => http.delete(`/budgets/${category}`);
