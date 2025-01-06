import { IJWTService } from "../../application/ports/service/IJWTService";
import { UnauthorizedError } from "../../shared/errors/ApplicationError";
import { Logger } from "../../shared/utils/Logger";
import { AppConfig } from "../config/AppConfig";
import jwt from 'jsonwebtoken';

export class JWTService implements IJWTService {
    private readonly secretKey: string;
    private readonly expiresIn: string;
    private readonly refreshTokenSecret: string;

    constructor(config: AppConfig) {
        this.secretKey = config.auth.jwtSecret; 
        this.expiresIn = config.auth.jwtExpiresIn || '1d';
        this.refreshTokenSecret = config.auth.refreshTokenSecret;
    }

    generateToken(payload: any): string {
        try {
            return jwt.sign(payload, this.secretKey, {
                expiresIn: this.expiresIn
            });
        } catch (error) {
            Logger.error('Token generation error:', error);
            throw new UnauthorizedError('Failed to generate access token');
        }
    }

    generateRefreshToken(payload: any): string {
        try {
            return jwt.sign(payload, this.refreshTokenSecret, {
                expiresIn: '7d'
            });
        } catch (error) {
            Logger.error('Refresh token generation error:', error);
            throw new UnauthorizedError('Failed to generate refresh token');
        }
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }
            throw new UnauthorizedError('Invalid token');
        }
    }
}