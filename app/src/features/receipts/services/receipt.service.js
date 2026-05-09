export const buildReceiptData = (expenses, incomes) => {
    const byYear = {};
    const ensureYear = (year) => {
        if (!byYear[year]) {
            byYear[year] = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                income: 0,
                expenses: 0,
                profit: 0,
            }));
        }
        return byYear[year];
    };

    for (const expense of expenses) {
        const date = new Date(expense.expense_date);
        ensureYear(date.getFullYear())[date.getMonth()].expenses += Number(expense.expense_amount);
    }

    for (const income of incomes) {
        const date = new Date(income.income_date);
        ensureYear(date.getFullYear())[date.getMonth()].income += Number(income.income_amount);
    }

    for (const year of Object.keys(byYear)) {
        byYear[year] = byYear[year]
            .map(monthData => ({ ...monthData, profit: monthData.income - monthData.expenses }))
            .filter(monthData => monthData.income > 0 || monthData.expenses > 0);
    }

    const availableYears = Object.keys(byYear).map(Number).sort((a, b) => b - a);
    return { availableYears, byYear };
};

export const buildMonthDetail = (expenses, incomes, year, month) => {
    const matches = (dateStr) => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
    };

    return {
        year,
        month,
        expenses: expenses.filter(expense => matches(expense.expense_date)),
        incomes: incomes.filter(income => matches(income.income_date)),
    };
};
