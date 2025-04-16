import { AuthService } from './auth.service';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { SignUpDto } from './dto/sign-up.dto';
import { Request } from 'express';
import { LogInDto } from './dto/log-in.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginAttempt } from './entities/login-attempt.entity';
import { User } from '../users/entities/user.entity';
import { VerifyOtpCodeDto } from './dto/verify-otp-code.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto, req: Request): Promise<IResponse>;
    logIn(logInDto: LogInDto, req: Request): Promise<IResponse>;
    findMe(currentUser: User): Promise<IResponse>;
    forgetPassword(forgetPasswordDto: ForgotPasswordDto): Promise<IResponse>;
    verifyOtpCode(verifyOtpCodeDto: VerifyOtpCodeDto): Promise<IResponse>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<IResponse>;
    logout(currentLoginAttempt: LoginAttempt): Promise<IResponse>;
}
