
import About from "../pages/About";
import Home from "../pages/Home";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CategoryList from "../features/categories/pages/CategoryList";
import CategoryForm from "../features/categories/pages/CategoryForm";
import ExpenseList from "../features/expenses/pages/ExpenseList";
import ExpenseForm from "../features/expenses/pages/ExpenseForm";
import IncomeList from "../features/incomes/pages/IncomeList";
import IncomeForm from "../features/incomes/pages/IncomeForm";
import ReceiptList from "../features/receipts/pages/ReceiptList";
import ReceiptDetail from "../features/receipts/pages/ReceiptDetail";
import AccountList from "../features/accounts/pages/AccountList";
import AccountForm from "../features/accounts/pages/AccountForm";
export const routes = [
    {path: "/", element: Home, type: "public"},
    {path: "/about", element: About, type: "public"},
    {path: "/dashboard", element: Dashboard, type: "protected"},
    {path: "/categories", element: CategoryList, type: "protected"},
    {path: "/categories/new", element: CategoryForm, type: "protected"},
    {path: "/categories/:id/edit", element: CategoryForm, type: "protected"},
    {path: "/expenses", element: ExpenseList, type: "protected"},
    {path: "/expenses/new", element: ExpenseForm, type: "protected"},
    {path: "/expenses/:id/edit", element: ExpenseForm, type: "protected"},
    {path: "/incomes", element: IncomeList, type: "protected"},
    {path: "/incomes/new", element: IncomeForm, type: "protected"},
    {path: "/incomes/:id/edit", element: IncomeForm, type: "protected"},
    {path: "/receipts", element: ReceiptList, type: "protected"},
    {path: "/receipts/:year/:month", element: ReceiptDetail, type: "protected"},
    {path: "/accounts", element: AccountList, type: "protected"},
    {path: "/accounts/new", element: AccountForm, type: "protected"},
    {path: "/accounts/:id/edit", element: AccountForm, type: "protected"},
    {path: "/login", element: Login, type: "auth"},
    {path: "/register", element: Register, type: "auth"},
];
