const pool = require('../config/db');


class AccountRepository {

    static async getAccounts(user_id) {
        const result = await pool.query(
            'SELECT * FROM accounts WHERE user_account_id = $1 ORDER BY account_id ASC',
            [user_id]
        );
        return result.rows;
    }

    static async getAccount(account_id) {
        const result = await pool.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [account_id]
        );
        return result.rows[0] || null;
    }

    static async create({ user_id, account_name, account_type, account_balance }) {
        const result = await pool.query(
            `INSERT INTO accounts (user_account_id, account_name, account_type, account_balance)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [user_id, account_name, account_type, account_balance]
        );

        return result.rows[0];
    }

    static async update(account_id, { account_name, account_type, account_balance }) {
        const result = await pool.query(
            `UPDATE accounts
            SET account_name = $1,
            account_type = $2,
            account_balance = $3
            WHERE account_id = $4
            RETURNING *`,
            [account_name, account_type, account_balance, account_id]
        );

        return result.rows[0];
    }
    
    static async adjustBalance(account_id, amount) {
        const result = await pool.query(
            `UPDATE accounts SET account_balance = account_balance + $1 WHERE account_id = $2 RETURNING *`,
            [amount, account_id]
        );
        return result.rows[0] || null;
    }

    static async remove(account_id) {
        const result = await pool.query(
            `DELETE FROM accounts WHERE account_id = $1 RETURNING *`,
            [account_id]
        );

        return result.rowCount > 0;
    }
}

module.exports = AccountRepository;
