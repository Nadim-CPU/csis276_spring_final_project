import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Account, User, Income, Expense]), SocketModule],
    providers: [AccountService, AccountResolver],
    exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
