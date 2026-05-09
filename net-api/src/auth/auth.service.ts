import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterInput) {
        const existing = await this.userRepository.findOneBy({ user_email: dto.user_email });
        if (existing) {
            throw new ConflictException({
                code: 'CONFLICT',
                message: 'EMAIL ALREADY REGISTERED',
                details: { user_email: 'Email is already in use' },
            });
        }

        const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = this.userRepository.create({
            user_first_name: dto.user_first_name,
            user_last_name: dto.user_last_name,
            user_email: dto.user_email,
            user_dob: dto.user_dob,
            password_hash,
        });
        return this.userRepository.save(user);
    }

    async login(dto: LoginInput) {
        const user = await this.userRepository.findOneBy({ user_email: dto.user_email });
        if (!user || !user.password_hash) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const valid = await bcrypt.compare(dto.password, user.password_hash);
        if (!valid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const { password_hash: _ph, ...safeUser } = user;
        return {
            authenticated: true,
            user: safeUser,
            access_token: this.jwtService.sign({
                sub: user.user_id,
                user_email: user.user_email,
            }),
        };
    }
}
