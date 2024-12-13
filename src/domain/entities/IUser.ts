export interface IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    name: string;
    // googleId?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}