import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/user.entity';
import { Income } from './income.entity';
import { IncomeResolver } from './income.resolver';
import { IncomeService } from './income.service';

@Module({
    imports: [TypeOrmModule.forFeature([Income, User]), AccountModule, SocketModule],
    providers: [IncomeService, IncomeResolver],
    exports: [IncomeService],
})
export class IncomeModule {}
