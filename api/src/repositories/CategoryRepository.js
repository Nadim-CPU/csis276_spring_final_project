const pool = require('../config/db');


class CategoryRepository {

    static async getCategories(user_id) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_category_id = $1',
            [user_id]
        );
        return result.rows;
    }

    static async getCategory(category_id) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE category_id = $1',
            [category_id]
        );
        return result.rows[0] || null;
    }

    static async create({ user_id, category_name, type }) {
        const result = await pool.query(
            `INSERT INTO categories (user_category_id, category_name, type)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [user_id, category_name, type]
        );

        return result.rows[0];
    }

    static async update(category_id, { category_name }) {
        const result = await pool.query(
            `UPDATE categories
            SET category_name = $1
            WHERE category_id = $2
            RETURNING *`,
            [category_name, category_id]
        );

        return result.rows[0];
    }

    static async remove(category_id) {
        const result = await pool.query(
            `DELETE FROM categories WHERE category_id = $1 RETURNING *`,
            [category_id]
        );

        return result.rowCount > 0;
    }
}

module.exports = CategoryRepository;