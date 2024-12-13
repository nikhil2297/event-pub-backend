import { NextFunction, Request, Response } from "express";
import { IUserRepository } from "../../../../application/ports/IUserRepository";
import { SignInUseCase } from "../../../../application/usecases/auth/SignInUseCase";
import { SignUpUseCase } from "../../../../application/usecases/auth/SingupUseCase";
import { ResponseFormatter } from "../../../../shared/utils/ResponseFormatter";
import { IJWTService } from "../../../../application/ports/IJWTService";
import { AppConfig } from "../../../config/AppConfig";
import { JWTService } from "../../../services/JWTService";

export class AuthController {
    private  signUpUseCase: SignUpUseCase;
        private  signInUseCase: SignInUseCase;
    private jwtService : IJWTService;
    constructor(private readonly userRepository: IUserRepository) {
        this.signInUseCase = new SignInUseCase(userRepository);
        this.signUpUseCase = new SignUpUseCase(userRepository);
        this.jwtService = new JWTService(new AppConfig());
    }


    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            
            const user = await this.signUpUseCase.execute(req.body);

            res.json(ResponseFormatter.success(user));
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { identifier, password } = req.body;
            const user = await this.signInUseCase.execute(identifier, password);
            const token = this.jwtService.generateToken({
                userId: user.username,
                email: user.email
            });

            const refreshToken = this.jwtService.generateRefreshToken({
                userId: user.username
            });

            this.setAuthCookies(res, token, refreshToken);

            res.json(ResponseFormatter.success(user));
        } catch (error) {
            next(error);
        }
    }

    private setAuthCookies(res: Response, token: string, refreshToken: string): void {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/v1/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}