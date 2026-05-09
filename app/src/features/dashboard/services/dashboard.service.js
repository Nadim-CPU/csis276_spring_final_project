const PALETTE = [
    "steelblue", "seagreen", "orange", "mediumpurple",
    "hotpink", "darkturquoise", "darkorange", "slategray",
];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const groupByCategory = (items, amountKey) => {
    const map = new Map();
    for (const item of items) {
        const key = item.category?.category_name ?? 'Uncategorized';
        map.set(key, (map.get(key) || 0) + Number(item[amountKey]));
    }
    return Array.from(map.entries())
        .map(([name, value], idx) => ({ name, value, color: PALETTE[idx % PALETTE.length] }))
        .sort((a, b) => b.value - a.value);
};

export const buildDashboardData = (expenses, incomes) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const inCurrentMonth = (dateStr) => {
        const date = new Date(dateStr);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    };

    const monthExpenses = expenses.filter(expense => inCurrentMonth(expense.expense_date));
    const monthIncomes = incomes.filter(income => inCurrentMonth(income.income_date));

    /* the .reduce function below is used to get a total of every income and expense with out having to create a loop to add them together normally
      the 0 at the end is where the sum will start at. also Number() is used to prevent weird cases
    */
    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + Number(expense.expense_amount), 0);
    const totalIncome = monthIncomes.reduce((sum, income) => sum + Number(income.income_amount), 0);
    const currentMonthProfit = totalIncome - totalExpenses;
    
    const expenseByCategory = groupByCategory(monthExpenses, "expense_amount");
    const incomeByCategory = groupByCategory(monthIncomes, "income_amount");
    const topExpenseCategories = expenseByCategory.slice(0, 5);

    const yearProfit = MONTH_SHORT.map(monthLabel => ({ month: monthLabel, income: 0, expenses: 0, profit: 0 }));
    for (const expense of expenses) {
        const date = new Date(expense.expense_date);
        if (date.getFullYear() === currentYear) {
            yearProfit[date.getMonth()].expenses += Number(expense.expense_amount);
        }
    }
    for (const income of incomes) {
        const date = new Date(income.income_date);
        if (date.getFullYear() === currentYear) {
            yearProfit[date.getMonth()].income += Number(income.income_amount);
        }
    }
    for (const monthData of yearProfit) {
        monthData.profit = monthData.income - monthData.expenses;
    }
    const totalYearProfit = yearProfit.reduce((sum, monthData) => sum + monthData.profit, 0);

    return {
        currentYear,
        currentMonth,
        totalIncome,
        totalExpenses,
        currentMonthProfit,
        expenseByCategory,
        topExpenseCategories,
        incomeByCategory,
        yearProfit,
        totalYearProfit,
    };
};
