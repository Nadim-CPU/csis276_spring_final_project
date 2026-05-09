import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../user/user.entity';
import { CreateIncomeInput } from './dto/create-income.input';
import { UpdateIncomeInput } from './dto/update-income.input';
import { Income } from './income.entity';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepository: Repository<Income>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly accountService: AccountService,
        private readonly socketGateway: SocketGateway,
    ) {}

    async getIncomes(user_id: number) {
        const userExists = await this.userRepository.findOneBy({ user_id });
        if (!userExists) {
            throw new NotFoundException(`ID ${user_id} is non-existent!`);
        }
        return this.incomeRepository.find({
            where: { user_income_id: user_id },
            order: { income_id: 'ASC' },
        });
    }

    async getIncome(id: number) {
        const income = await this.incomeRepository.findOneBy({ income_id: id });
        if (!income) {
            throw new NotFoundException(`Income ID ${id} is non-existent!`);
        }
        return income;
    }

    async create(input: CreateIncomeInput) {
        const userExists = await this.userRepository.findOneBy({ user_id: input.user_id });
        if (!userExists) {
            throw new NotFoundException(`ID ${input.user_id} is non-existent!`);
        }

        const income = this.incomeRepository.create({
            user_income_id: input.user_id,
            income_amount: input.income_amount,
            income_source: input.income_source,
            income_date: input.income_date,
            category_income_id: input.category_income_id,
            account_income_id: input.account_income_id,
        });
        const saved = await this.incomeRepository.save(income);

        await this.accountService.adjustBalance(input.account_income_id, input.income_amount);

        this.socketGateway.broadcast('income.changed', { user_id: input.user_id });
        return this.getIncome(saved.income_id);
    }

    async update(id: number, input: UpdateIncomeInput) {
        const oldIncome = await this.getIncome(id);

        await this.incomeRepository.update(id, {
            income_amount: input.income_amount,
            income_source: input.income_source,
            income_date: input.income_date,
            category_income_id: input.category_income_id,
            account_income_id: input.account_income_id,
        });

        await this.accountService.adjustBalance(
            oldIncome.account_income_id,
            -Number(oldIncome.income_amount),
        );
        await this.accountService.adjustBalance(
            input.account_income_id,
            Number(input.income_amount),
        );

        this.socketGateway.broadcast('income.changed', { user_id: oldIncome.user_income_id });
        return this.getIncome(id);
    }

    async remove(id: number) {
        const income = await this.getIncome(id);

        await this.accountService.adjustBalance(
            income.account_income_id,
            -Number(income.income_amount),
        );

        await this.incomeRepository.delete(id);
        this.socketGateway.broadcast('income.changed', { user_id: income.user_income_id });
    }
}
