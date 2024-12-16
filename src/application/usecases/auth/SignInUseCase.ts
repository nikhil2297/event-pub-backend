import { IUser } from "../../../domain/entities/IUser";
import { UnauthorizedError } from "../../../shared/errors/ApplicationError";
import { IUserRepository } from "../../ports/repository/IUserRepository";
import { UserValidator } from "../../validators/UserValidator";

export class SignInUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(identifier: string, password: string): Promise<IUser> {
        let user: IUser | null = null;

        UserValidator.validateSignInUser(identifier, password);


        if (this.isEmail(identifier)) {
            user = await this.userRepository.findByEmail(identifier);
        } else {
            user = await this.userRepository.findByUsername(identifier);
        }

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValidPassword = await this.userRepository.validatePassword(
            password,
            user.password
        );

        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid credentials');
        }

        return user;
    }

    private isEmail(identifier: string): boolean {
        return identifier.includes('@');
    }
}