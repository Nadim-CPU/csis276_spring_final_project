import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../user/user.entity';
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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly socketGateway: SocketGateway,
    ) {}

    async getCategories(user_id: number) {
        const userExists = await this.userRepository.findOneBy({ user_id });
        if (!userExists) {
            throw new NotFoundException(`ID ${user_id} is non-existent!`);
        }
        return this.categoryRepository.find({
            where: { user_category_id: user_id },
        });
    }

    async getCategory(category_id: number) {
        const category = await this.categoryRepository.findOneBy({ category_id });
        if (!category) {
            throw new NotFoundException(`Category ID ${category_id} is non-existent`);
        }
        return category;
    }

    async create(input: CreateCategoryInput) {
        const userExists = await this.userRepository.findOneBy({ user_id: input.user_id });
        if (!userExists) {
            throw new NotFoundException(`ID ${input.user_id} is non-existent`);
        }
        // Ensures that no duplicates occur when creating a new category
        const duplicate = await this.categoryRepository.findOneBy({
            user_category_id: input.user_id,
            category_name: input.category_name,
        });
        if (duplicate) {
            throw new ConflictException(
                `Category "${input.category_name}" already exists for this user`,
            );
        }

        const category = this.categoryRepository.create({
            user_category_id: input.user_id,
            category_name: input.category_name,
            type: input.type,
        });
        const saved = await this.categoryRepository.save(category);
        this.socketGateway.broadcast('category.changed', { user_id: input.user_id });
        return saved;
    }

    async update(id: number, input: UpdateCategoryInput) {
        const current = await this.getCategory(id);

        // Ensures that no duplicates occur when updating a category name
        if (input.category_name !== current.category_name) {
            const duplicate = await this.categoryRepository.findOneBy({
                user_category_id: current.user_category_id,
                category_name: input.category_name,
                category_id: Not(id),
            });
            if (duplicate) {
                throw new ConflictException(
                    `Category "${input.category_name}" already exists for this user`,
                );
            }
        }

        await this.categoryRepository.update(id, input);
        this.socketGateway.broadcast('category.changed', { user_id: current.user_category_id });
        return this.getCategory(id);
    }

    async remove(id: number) {
        const current = await this.categoryRepository.findOneBy({ category_id: id });
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Category ID ${id} is non-existent`);
        }
        this.socketGateway.broadcast('category.changed', { user_id: current?.user_category_id });
    }
}
