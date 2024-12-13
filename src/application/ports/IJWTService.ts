export interface IJWTService {
    generateToken(payload: any): string;
    verifyToken(token: string): any;
    generateRefreshToken(payload: any): string;
}