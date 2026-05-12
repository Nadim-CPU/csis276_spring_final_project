import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../user/user.entity';
import { Account } from './account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';

/*  -------------------------------------------
*   |               ACCOUNT SERVICE           |
*   -------------------------------------------
*/
@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly socketGateway: SocketGateway,
    ) {}

    /*  -------------------------------------------
    *   |        GENERIC CRUD OPERATIONS          |
    *   -------------------------------------------
    */

    async getAccounts(user_id: number) {
        return this.accountRepository.find({
            where: { user_account_id: user_id },
            order: { account_id: 'ASC' },
        });
    }

    async getAccount(user_id: number, account_id: number) {
        const account = await this.accountRepository.findOneBy({ 
            account_id,
            user_account_id: user_id,
         });
        if (!account) {
            throw new NotFoundException(`Account ID ${account_id} is non-existent`);
        }
        return account;
    }

    async create(user_id: number, input: CreateAccountInput) {
        // Ensures no duplicates occur when creating a new account
        const duplicate = await this.accountRepository.findOneBy({
            user_account_id: user_id,
            account_name: input.account_name,
        });
        if (duplicate) {
            throw new ConflictException(
                `Account "${input.account_name}" already exists for this usser`,
            );
        }

        const account = this.accountRepository.create({
            user_account_id: user_id,
            account_name: input.account_name,
            account_type: input.account_type,
            account_balance: input.account_balance,
        });
        const saved = await this.accountRepository.save(account);
        this.socketGateway.broadcast('account.changed', { user_id });
        return saved;
    }

    async update(user_id: number, id: number, input: UpdateAccountInput) {
        const current = await this.getAccount(user_id, id);
        if (!current) {
            throw new NotFoundException(`Account ID ${id} is non-existent`);
        }

        // Ensures no duplicates occur when updating account name
        if (input.account_name !== current.account_name) {
            const duplicate = await this.accountRepository.findOneBy({
                user_account_id: user_id,
                account_name: input.account_name,
                account_id: Not(id),
            });
            if (duplicate) {
                throw new ConflictException(
                    `Account "${input.account_name}" already exists for this user`,
                );
            }
        }

        await this.accountRepository.update({ account_id: id, user_account_id: user_id, }, input);
        this.socketGateway.broadcast('account.changed', { user_id });
        return this.getAccount(user_id, id);
    }

    async remove(user_id: number, id: number) {
        const current = await this.getAccount(user_id, id);
        if (!current) {
            throw new NotFoundException(`Account ID ${id} is non-existent`);
        }
        await this.accountRepository.delete(id);
        
        this.socketGateway.broadcast('account.changed', { user_id });
    }

    /*  -------------------------------------------
    *   |               OTHER OPERATIONS          |
    *   -------------------------------------------
    */
    async adjustBalance(account_id: number, amount: number) {
        await this.accountRepository.increment({ account_id }, 'account_balance', amount);
        const account = await this.accountRepository.findOneBy({ account_id });
        this.socketGateway.broadcast('account.changed', { user_id: account?.user_account_id });
    }
}
