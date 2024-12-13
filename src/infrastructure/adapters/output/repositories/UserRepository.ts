import { IUserRepository } from "../../../../application/ports/IUserRepository";
import { CreateUserDTO } from "../../../../domain/dtos/CreateUserDTO";
import { IUser } from "../../../../domain/entities/IUser";
import bcrypt from "bcrypt";
import { UserModel } from "../schemas/UserSchema";
import { Logger } from "../../../../shared/utils/Logger";
import { DatabaseError, NotFoundError, UnauthorizedError } from "../../../../shared/errors/ApplicationError";

export class UserRepository implements IUserRepository {
    async create(data: CreateUserDTO): Promise<IUser> {
        try {
            if(data.password) {
                data.password = await bcrypt.hash(data.password, 10);
            }

            if(data.username === undefined) {
                data.username = data.email!.split('@')[0];
            }

            Logger.info('Creating user:', data);

            const user = new UserModel(data);
            const savedUser = await user.save();
            return this.toUser(savedUser);
        }catch (error) {
            Logger.error("Error creating user", error);
            throw new DatabaseError('Error creating user');

        }
    }
    
    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            return user ? this.toUser(user) : null;
        } catch (error) {
            Logger.error('Error finding user by email:', error);
            throw new NotFoundError(`User with email ${email}`);
        }
    }

    async findByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ username: username.toLowerCase() });
            return user ? this.toUser(user) : null;
        } catch (error) {
            Logger.error('Error finding user by email:', error);
            throw new NotFoundError(`User with username ${username}`);
        }    
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            Logger.error('Error validating password:', error);
            throw new UnauthorizedError('Please check your credentials and try again');
        }
    }


    private toUser(document: any): IUser {
        const user = document.toObject();
        return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            password: user.password,
            name: user.name? user.name : '',
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}