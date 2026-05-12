import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SocketGateway } from '../socket/socket.gateway';
import { Category } from './category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

/*  -------------------------------------------
*   |              CATEGORY SERVICE           |
*   -------------------------------------------
*/

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly socketGateway: SocketGateway,
    ) {}

    /*  -------------------------------------------
    *   |        GENERIC CRUD OPERATIONS          |
    *   -------------------------------------------
    */

    async getCategories(user_id: number) {
        return this.categoryRepository.find({
            where: { user_category_id: user_id },
        });
    }

    async getCategory(category_id: number, user_id: number) {
        const category = await this.categoryRepository.findOneBy({ 
            category_id,
            user_category_id: user_id });
        if (!category) {
            throw new NotFoundException(`Category ID ${category_id} is non-existent`);
        }
        return category;
    }

    async create(input: CreateCategoryInput, user_id: number) {
        // Ensures that no duplicates occur when creating a new category
        const duplicate = await this.categoryRepository.findOneBy({
            user_category_id: user_id,
            category_name: input.category_name,
        });
        if (duplicate) {
            throw new ConflictException(
                `Category "${input.category_name}" already exists for this user`,
            );
        }

        const category = this.categoryRepository.create({
            user_category_id: user_id,
            category_name: input.category_name,
            type: input.type,
        });
        const saved = await this.categoryRepository.save(category);
        this.socketGateway.broadcast('category.changed', { user_id });
        return saved;
    }

    async update(id: number, input: UpdateCategoryInput, user_id: number) {
        const current = await this.getCategory(id, user_id);
        if (!current) {
            throw new NotFoundException(`Category ID ${id} is non-existent`);
        }
        // Ensures that no duplicates occur when updating a category name
        if (input.category_name !== current.category_name) {
            const duplicate = await this.categoryRepository.findOneBy({
                user_category_id: user_id,
                category_name: input.category_name,
                category_id: Not(id),
            });
            if (duplicate) {
                throw new ConflictException(
                    `Category "${input.category_name}" already exists for this user`,
                );
            }
        }

        await this.categoryRepository.update({ category_id: id, user_category_id: user_id, }, input);
        this.socketGateway.broadcast('category.changed', { user_id });
        return await this.getCategory(id, user_id);
    }

    async remove(id: number, user_id: number) {
        const current = await this.getCategory(id, user_id);
        if (!current) {
            throw new NotFoundException(`Category ID ${id} is non-existent`);
        }
        await this.categoryRepository.delete(id);
        
        this.socketGateway.broadcast('category.changed', { user_id });
    }
}
