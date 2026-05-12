import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(user_id: number) {
        const user = await this.userRepository.findOneBy({ user_id });
        if (!user) {
            throw new NotFoundException(`User ${user_id} not found`);
        }
        return user;
    }

    findByEmail(email: string) {
        return this.userRepository.findOneBy({ user_email: email });
    }

    async update(user_id: number, input: UpdateUserInput) {
        const result = await this.userRepository.update(user_id, input);
        if (result.affected === 0) {
            throw new NotFoundException(`User ${user_id} not found`);
        }
        return this.findOne(user_id);
    }

    async remove(user_id: number) {
        const result = await this.userRepository.delete(user_id);
        if (result.affected === 0) {
            throw new NotFoundException(`User ${user_id} not found`);
        }
    }
}
