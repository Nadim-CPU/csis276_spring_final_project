import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/user.entity';
import { Expense } from './expense.entity';
import { ExpenseResolver } from './expense.resolver';
import { ExpenseService } from './expense.service';

@Module({
    imports: [TypeOrmModule.forFeature([Expense, User]), AccountModule, SocketModule],
    providers: [ExpenseService, ExpenseResolver],
    exports: [ExpenseService],
})
export class ExpenseModule {}
