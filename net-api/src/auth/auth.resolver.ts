import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload';
import { LoginWithFaceInput } from './dto/login-with-face.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => User)
    async register(@Args('input', { type: () => RegisterInput }) input: RegisterInput) {
        return await this.authService.register(input);
    }

    @Mutation(() => AuthPayload)
    async login(@Args('input', { type: () => LoginInput }) input: LoginInput) {
        return await this.authService.login(input);
    }

    @Mutation(() => AuthPayload)
    async loginWithFace(@Args('input', { type: () => LoginWithFaceInput }) input: LoginWithFaceInput) {
        return await this.authService.loginWithFace(input);
    }
}
