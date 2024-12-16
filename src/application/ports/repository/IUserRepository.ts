import { CreateUserDTO } from "../../domain/dtos/CreateUserDTO";
import { IUser } from "../../domain/entities/IUser";

export interface IUserRepository {
    create(data: CreateUserDTO): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}