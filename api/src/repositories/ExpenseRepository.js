const pool = require('../config/db');

class ExpenseRepository {

    /* Income and Expense use 2 left joins to get both categories
    *  and accounts for the list 
    *  nothing too complex tho
    */
    static async getExpenses(id) {
        const result = await pool.query(
            `SELECT e.expense_id, e.expense_amount, e.expense_source, e.expense_date,
                    e.category_expense_id, e.account_expense_id,
                    c.category_name, a.account_name
             FROM expenses e
             LEFT JOIN categories c ON c.category_id = e.category_expense_id
             LEFT JOIN accounts a ON a.account_id = e.account_expense_id
             WHERE e.user_expense_id = $1
             ORDER BY e.expense_id ASC`,
            [id]
        );
        return result.rows;
    }

    static async getExpense(id) {
        const result = await pool.query(
            `SELECT * FROM expenses WHERE expense_id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    static async create({ user_id, expense_amount, expense_source, expense_date, category_expense_id, account_expense_id }) {
        const result = await pool.query(
            `INSERT INTO expenses (user_expense_id, expense_amount, expense_source, expense_date, category_expense_id, account_expense_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [user_id, expense_amount, expense_source, expense_date, category_expense_id, account_expense_id]
        );
        return result.rows[0];
    }

    static async update(id, { expense_amount, expense_source, expense_date, category_expense_id, account_expense_id }) {
        const result = await pool.query(
            `UPDATE expenses
             SET expense_amount = $1,
                 expense_source = $2,
                 expense_date = $3,
                 category_expense_id = $4,
                 account_expense_id = $5
             WHERE expense_id = $6
             RETURNING *`,
            [expense_amount, expense_source, expense_date, category_expense_id, account_expense_id, id]
        );

        return result.rows[0] || null;
    }

    static async remove(id) {
        const result = await pool.query(
            `DELETE FROM expenses WHERE expense_id = $1 RETURNING *`,
            [id]
        );
        return result.rowCount > 0;
    }
}

module.exports = ExpenseRepository;