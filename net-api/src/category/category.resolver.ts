import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CurrentUser } from '../auth/current/current-user.decorator';

/*  -------------------------------------------
*   |            CATEGORY RESOLVER            |
*   -------------------------------------------
*/
@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Query(() => [Category], { name: 'categories' })
    async getCategories(@CurrentUser('user_id') user: number) {
        console.log('User object from JWT: ', user);
        return await this.categoryService.getCategories(user);
    }

    @Query(() => Category, { name: 'category' })
    async getCategory(@Args('id', { type: () => Int }) id: number, @CurrentUser('user_id') user: number) {
        return await this.categoryService.getCategory(id, user);
    }

    @Mutation(() => Category)
    async createCategory(@CurrentUser('user_id') user: number, @Args('input') input: CreateCategoryInput) {
        return await this.categoryService.create(input, user);
    }

    @Mutation(() => Category)
    async updateCategory(
        @Args('id', { type: () => Int }) id: number,
        @CurrentUser('user_id') user: number,
        @Args('input') input: UpdateCategoryInput,
    ) {
        return await this.categoryService.update(id, input, user);
    }

    @Mutation(() => OperationResult)
    async removeCategory(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        await this.categoryService.remove(id, user);
        return { success: true };
    }
}
