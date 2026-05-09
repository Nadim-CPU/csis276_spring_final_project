const pool = require('../config/db');

class IncomeRepository {

    /* Income and Expense use 2 left joins to get both categories 
    *  and accounts columns for the list 
    *  nothing too complex tho
    */
    static async getIncomes(id) {
        const result = await pool.query(
            `SELECT i.income_id, i.income_amount, i.income_source, i.income_date,
                    i.category_income_id, i.account_income_id,
                    c.category_name, a.account_name
             FROM incomes i
             LEFT JOIN categories c ON c.category_id = i.category_income_id
             LEFT JOIN accounts a ON a.account_id = i.account_income_id
             WHERE i.user_income_id = $1
             ORDER BY i.income_id ASC`,
            [id]
        );
        return result.rows;
    }

    static async getIncome(id) {
        const result = await pool.query(
            `SELECT * FROM incomes WHERE income_id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    static async create({ user_id, income_amount, income_source, income_date, category_income_id, account_income_id }) {
        const result = await pool.query(
            `INSERT INTO incomes (user_income_id, income_amount, income_source, income_date, category_income_id, account_income_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [user_id, income_amount, income_source, income_date, category_income_id, account_income_id]
        );

        return result.rows[0];
    }

    static async update(id, { income_amount, income_source, income_date, category_income_id, account_income_id }) {
        const result = await pool.query(
            `UPDATE incomes
             SET income_amount = $1,
                 income_source = $2,
                 income_date = $3,
                 category_income_id = $4,
                 account_income_id = $5
             WHERE income_id = $6
             RETURNING *`,
            [income_amount, income_source, income_date, category_income_id, account_income_id, id]
        );

        return result.rows[0] || null;
    }

    static async remove(id) {
        const result = await pool.query(
            `DELETE FROM incomes WHERE income_id = $1 RETURNING *`,
            [id]
        );
        return result.rowCount > 0;
    }
}

module.exports = IncomeRepository;