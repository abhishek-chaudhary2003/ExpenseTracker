
# Expense Tracker

A full-stack expense tracking application built as part of the **Studio Graphene Programme Take-Home Assignment (Exercise 2: Mini Expense Tracker)**.

This application helps users track expenses, manage budgets, analyze spending habits, and visualize financial data through an intuitive dashboard. Expense and budget data persist across server restarts using JSON file storage.

---

# Live Demo

## Frontend Deployment

**Live App:**  
https://expense-tracker-6lizlrgog-abhishek10299s-projects.vercel.app/

---

## Backend Deployment

**API Base URL:**  
https://expensetracker-cyio.onrender.com

---

# Features

## Must-Have Features

### Expense Management

- Create new expenses with:
  - Amount
  - Category
  - Description
  - Date

### Expense Viewing

- View all expenses
- Sort expenses by:
  - Date
  - Amount

### Expense Editing

- Update:
  - Amount
  - Category
  - Description
  - Date

### Expense Deletion

- Delete expenses when no longer needed

### Expense Filtering

- Filter expenses by category

---

## Should-Have Features

### Dashboard Summary

- Total spending overview
- Category-wise spending breakdown
- Monthly expense summary

### Data Visualization

- Expense charts
- Spending analytics
- Category distribution

### Responsive Design

- Mobile-friendly interface
- Tablet support
- Desktop support

---

## Bonus Features

### Budget Management

- Set monthly budgets by category
- Edit existing budgets
- Remove budgets

### Budget Tracking

- Visual budget progress bars
- Over-budget alerts
- Percentage-based spending indicators

### CSV Export

- Export expense data as CSV

### Persistent Storage

- Data remains available after server restarts using JSON files

### Modern UI

- Built with Tailwind CSS
- Clean dashboard layout
- Fast and responsive interactions

---

# Tech Stack

## Frontend

### React (Vite)

Used for building a fast and responsive user interface.

### Tailwind CSS

Used for modern styling and responsive layouts.

### TanStack React Query

Used for API state management, caching, and synchronization.

### Axios

Used for communication with backend APIs.

### Recharts

Used for data visualization and expense analytics.

### Lucide React

Used for dashboard icons and actions.

---

## Backend

### Node.js

Runtime environment for server-side development.

### Express.js

Used for building RESTful APIs.

### UUID

Used for generating unique IDs.

### CORS

Used for secure frontend-backend communication.

### dotenv

Used for environment variable management.

### JSON File Storage

Used for lightweight data persistence.

---

# Why This Stack?

For this assignment, I chose JSON file storage instead of a database to keep the application lightweight while still supporting persistence across server restarts.

The implementation focuses on:

- Clean architecture
- REST API design
- Fast user experience
- Responsive UI
- Maintainable code
- Efficient state management

---

# Project Structure

```txt
expense-tracker/
│
├── client/
│   ├── src/
│   │
│   ├── components/
│   │   ├── BudgetPanel.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseTable.jsx
│   │   ├── SummaryCards.jsx
│   │   └── Charts.jsx
│   │
│   ├── hooks/
│   │   ├── useExpenses.js
│   │   └── useBudgets.js
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── db/
│   │   ├── expenses.js
│   │   └── budgets.js
│   │
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   └── budgetRoutes.js
│   │
│   ├── data/
│   │   ├── expenses.json
│   │   └── budgets.json
│   │
│   ├── index.js
│   └── package.json
│
└── README.md
````

---

# API Documentation

## Base URL

### Local Development

```txt
http://localhost:3001/api
```

### Production

```txt
https://expensetracker-cyio.onrender.com/api
```

---

## Expenses

### Get All Expenses

```http
GET /api/expenses
```

#### Query Parameters

| Parameter | Description        |
| --------- | ------------------ |
| category  | Filter by category |
| sortBy    | Sort expenses      |

---

### Create Expense

```http
POST /api/expenses
```

#### Example Request

```json
{
  "amount": 500,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-06-25"
}
```

---

### Update Expense

```http
PATCH /api/expenses/:id
```

---

### Delete Expense

```http
DELETE /api/expenses/:id
```

---

### Get Expense Summary

```http
GET /api/expenses/summary
```

Returns:

* Total expenses
* Category totals
* Dashboard statistics

---

## Budgets

### Get Budgets

```http
GET /api/budgets
```

---

### Set Budget

```http
PUT /api/budgets/:category
```

#### Example Request

```json
{
  "limit": 5000
}
```

---

### Delete Budget

```http
DELETE /api/budgets/:category
```

---

# How to Run Locally

## Prerequisites

* Node.js (v18 or later recommended)
* npm

---

## Backend Setup

Move into server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3001
```

---

## Frontend Setup

Open another terminal.

Move into frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Performance Optimizations

* React Query caching
* Optimistic UI updates
* Efficient API requests
* Fast client-side filtering
* Lightweight JSON storage
* Responsive rendering

---

# What Works

* Expense CRUD operations
* Expense filtering
* Expense sorting
* Budget management
* Budget progress tracking
* Dashboard analytics
* Expense charts
* CSV export
* Persistent storage
* Responsive design

---

# Known Limitations

* No authentication system
* Single-user application
* JSON storage not suitable for large-scale production use
* No recurring expenses
* No automated tests

---

# Future Improvements / Next Steps

If given more time, I would add:

* User authentication
* Multi-user support
* SQLite or PostgreSQL database
* Recurring expense tracking
* Budget notifications
* Dark mode
* Receipt uploads
* Automated testing
* Progressive Web App (PWA)

---

# Notes

AI tools were used for debugging support, implementation guidance, and development assistance. All generated code and suggestions were reviewed, understood, and adapted before inclusion in the final submission.

---

# Author

Built by **Abhishek Chaudhary** for the **Studio Graphene Programme Take-Home Assignment**.

