import { CreateUserDTO } from "../../domain/dtos/CreateUserDTO";
import { ValidationError } from "../../shared/errors/ApplicationError";

export class UserValidator {
    static validateCreateUser(data: CreateUserDTO) : void {
        if (!data.email && !data.username) {
            throw new ValidationError('Either email or username must be provided');
        }

        if (!data.password) {
            throw new ValidationError('Password is required');
        }

        if (data.email && !this.isValidEmail(data.email)) {
            throw new ValidationError('Invalid email format');
        }

        if (data.username && !this.isValidUsername(data.username)) {
            throw new ValidationError('Username must be between 3 and 30 characters and contain only letters, numbers, and underscores');
        }
    }

    static validateSignInUser(identifier: string, password: string) : void {
        if (!identifier) {
            throw new ValidationError('Email or username is required');
        }else {
            if(identifier.includes('@') && !this.isValidEmail(identifier)) {
                throw new ValidationError('Invalid email format');
            }
        }

        if (!password) {
            throw new ValidationError('Password is required');
        }
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static isValidUsername(username: string): boolean {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    }
}