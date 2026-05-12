import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { SocketGateway } from '../socket/socket.gateway';
import { CreateIncomeInput } from './dto/create-income.input';
import { UpdateIncomeInput } from './dto/update-income.input';
import { Income } from './income.entity';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepository: Repository<Income>,
        private readonly accountService: AccountService,
        private readonly socketGateway: SocketGateway,
    ) {}

    async getIncomes(user_id: number) {
        return this.incomeRepository.find({
            where: { user_income_id: user_id },
            order: { income_id: 'ASC' },
        });
    }

    async getIncome(user_id: number, id: number) {
        const income = await this.incomeRepository.findOneBy({ 
            income_id: id,
            user_income_id: user_id,
        });
        if (!income) {
            throw new NotFoundException(`Income ID ${id} is non-existent!`);
        }
        return income;
    }

    async create(user_id: number, input: CreateIncomeInput) {

        const income = this.incomeRepository.create({
            user_income_id: user_id,
            income_amount: input.income_amount,
            income_source: input.income_source,
            income_date: input.income_date,
            category_income_id: input.category_income_id,
            account_income_id: input.account_income_id,
        });
        const saved = await this.incomeRepository.save(income);

        await this.accountService.adjustBalance(input.account_income_id, input.income_amount);

        this.socketGateway.broadcast('income.changed', { user_id });
        return this.getIncome(user_id, saved.income_id);
    }

    async update(user_id: number, id: number, input: UpdateIncomeInput) {
        const oldIncome = await this.getIncome(user_id, id);

        await this.incomeRepository.update({income_id: id, user_income_id: user_id, }, input);

        const updatedIncome = await this.getIncome(user_id, id);
        // Removes previous amount affecting account to prevent stacking
        await this.accountService.adjustBalance(
            oldIncome.account_income_id,
            -Number(oldIncome.income_amount),
        );
        // Adds the new amount
        await this.accountService.adjustBalance(
            updatedIncome.account_income_id,
            Number(updatedIncome.income_amount),
        );

        this.socketGateway.broadcast('income.changed', { user_id: oldIncome.user_income_id });
        return updatedIncome
    }

    async remove(user_id: number, id: number) {
        const current = await this.getIncome(user_id, id);
        if (!current) {
            throw new NotFoundException(`Income ID ${id} is non-existent`);
        }

        // Refunds the amount back
        await this.accountService.adjustBalance(
            current.account_income_id,
            -Number(current.income_amount),
        );

        await this.incomeRepository.delete(id);
        this.socketGateway.broadcast('income.changed', { user_id});
    }
}
