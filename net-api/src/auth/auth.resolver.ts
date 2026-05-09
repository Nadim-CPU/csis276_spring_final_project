import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => User)
    register(@Args('input', { type: () => RegisterInput }) input: RegisterInput) {
        return this.authService.register(input);
    }

    @Mutation(() => AuthPayload)
    login(@Args('input', { type: () => LoginInput }) input: LoginInput) {
        return this.authService.login(input);
    }
}
