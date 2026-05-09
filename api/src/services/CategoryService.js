const CategoryRepository = require('../repositories/CategoryRepository');
const UserRepository = require('../repositories/UserRepository');
const APIError = require('../middlewares/APIError');


class CategoryService {
    static async getCategories(user_id) {
        const doesIDExist = await UserRepository.findByID(user_id);
        if (!doesIDExist) {
            throw APIError.notFound(` ID ${user_id} is non-existent!`);
        }
        return await CategoryRepository.getCategories(user_id);
    }

    static async getCategory(category_id) {
        const category = await CategoryRepository.getCategory(category_id);
        if (!category) {
            throw APIError.notFound(`Category ID ${category_id} is non-existent!`);
        }
        return category;
    }

    static async create(data) {
        const doesIDExist = await UserRepository.findByID(data.user_id);
        if (!doesIDExist) {
            throw APIError.notFound(` ID ${data.user_id} iss non-existent!`);
        }
        return await CategoryRepository.create(data);
    }

    static async update(id, data) {
        const category = await CategoryRepository.update(id ,data);
        if (!category) {
            throw APIError.notFound(` Category ID ${id} is non-existent!`);
        }
        return category;
    }

    static async remove(id) {
        const removed = await CategoryRepository.remove(id);
        if (!removed) {
            throw APIError.notFound(`Category ID ${id} is non-existent!`);
        }
    }
}

module.exports = CategoryService;