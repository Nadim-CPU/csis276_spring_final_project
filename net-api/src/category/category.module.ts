import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Category } from './category.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User, Expense, Income]), SocketModule],
    providers: [CategoryService, CategoryResolver],
    exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
