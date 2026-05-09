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

    findAll() {
        return this.userRepository.find({ order: { user_id: 'ASC' } });
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({ user_id: id });
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }
        return user;
    }

    findByEmail(email: string) {
        return this.userRepository.findOneBy({ user_email: email });
    }

    async update(id: number, input: UpdateUserInput) {
        const result = await this.userRepository.update(id, input);
        if (result.affected === 0) {
            throw new NotFoundException(`User ${id} not found`);
        }
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User ${id} not found`);
        }
    }
}
