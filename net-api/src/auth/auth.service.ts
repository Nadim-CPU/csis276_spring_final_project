import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginWithFaceInput } from './dto/login-with-face.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

const SALT_ROUNDS = 10;
const FACE_MATCH_THRESHOLD = 0.6;

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
            face_descriptor: dto.face_descriptor ?? null,
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

        return this.issueAuthPayload(user);
    }

    async loginWithFace(dto: LoginWithFaceInput) {
        const user = await this.userRepository.findOneBy({ user_email: dto.user_email });
        if (!user || !user.face_descriptor || user.face_descriptor.length !== 128) {
            throw new UnauthorizedException('Face login is not set up for this account');
        }

        const distance = euclideanDistance(user.face_descriptor, dto.descriptor);
        if (distance > FACE_MATCH_THRESHOLD) {
            throw new UnauthorizedException('Face does not match');
        }

        return this.issueAuthPayload(user);
    }

    private issueAuthPayload(user: User) {
        const { password_hash: _ph, face_descriptor: _fd, ...safeUser } = user;
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

function euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}
