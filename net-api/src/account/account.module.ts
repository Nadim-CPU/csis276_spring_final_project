import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
    imports: [TypeOrmModule.forFeature([Account, User]), SocketModule],
    providers: [AccountService, AccountResolver],
    exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
