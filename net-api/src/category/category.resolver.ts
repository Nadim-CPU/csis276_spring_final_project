import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Query(() => [Category], { name: 'categories' })
    getCategories(@Args('user_id', { type: () => Int }) user_id: number) {
        return this.categoryService.getCategories(user_id);
    }

    @Query(() => Category, { name: 'category' })
    getCategory(@Args('id', { type: () => Int }) id: number) {
        return this.categoryService.getCategory(id);
    }

    @Mutation(() => Category)
    createCategory(@Args('input') input: CreateCategoryInput) {
        return this.categoryService.create(input);
    }

    @Mutation(() => Category)
    updateCategory(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateCategoryInput,
    ) {
        return this.categoryService.update(id, input);
    }

    @Mutation(() => OperationResult)
    async removeCategory(@Args('id', { type: () => Int }) id: number) {
        await this.categoryService.remove(id);
        return { success: true };
    }
}
