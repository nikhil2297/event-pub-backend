import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { IUserRepository } from "../../application/ports/IUserRepository";
import { SignInUseCase } from "../../application/usecases/auth/SignInUseCase";
import { AppConfig } from "./AppConfig";
import { UnauthorizedError, ConnectionError } from "../../shared/errors/ApplicationError";
import { Logger } from "../../shared/utils/Logger";

export class PassportConfig {
    private appConfig: AppConfig
    constructor(private readonly userRepository: IUserRepository) {
        this.appConfig = new AppConfig();
        this.initializePassport();
    }

    private initializePassport() : void {
        const signInUseCase = new SignInUseCase(this.userRepository);
        

        passport.use(new LocalStrategy(
            {
                usernameField: 'identifier',
                passwordField: 'password'
            },
            async (identifier, password, done) => {
                try {
                    const user = await signInUseCase.execute(identifier, password);
                    return done(null, user);
                } catch (error) {
                    if (error instanceof UnauthorizedError) {
                        return done(null, false, { message: error.message });
                    }
                    Logger.error('Authentication error:', error);
                    return done(new ConnectionError('Authentication failed'));
                }
            }
        ))
    }
}