import { CreateUserDTO } from "../../../domain/dtos/CreateUserDTO";
import { IUser } from "../../../domain/entities/IUser";
import { ConnectionError, ValidationError } from "../../../shared/errors/ApplicationError";
import { IUserRepository } from "../../ports/IUserRepository";
import { UserValidator } from "../../validators/UserValidator";

export class SignUpUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO): Promise<IUser> {
        UserValidator.validateCreateUser(data);

        if(data.email) {
            const existingUserByEmail = await this.userRepository.findByEmail(data.email);
            if(existingUserByEmail) {
                throw new ValidationError('Email already registered');
            }
        }

        if (data.username) {
            const existingUserByUsername = await this.userRepository.findByUsername(data.username);
            if (existingUserByUsername) {
                throw new ValidationError('Username already taken');
            }
        }

        try {
            return await this.userRepository.create(data);
        } catch (error) {
            throw new ConnectionError('Failed to create user');
        }
    }
}