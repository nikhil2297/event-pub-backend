import { UnauthorizedError } from "../../shared/errors/ApplicationError";
import { Logger } from "../../shared/utils/Logger";
import { AppConfig } from "../config/AppConfig";
import { JWTService } from "../services/JWTService";
import { Request, Response, NextFunction } from "express";

export class TokenMiddleware {
    private static jwtService : JWTService = new JWTService(new AppConfig());; 

    static validateToken = (req: Request, res: Response, next: NextFunction) => {
        try {
            Logger.debug("Cookies : ", req.cookies);
            const token = req.cookies.token;

            if(!token) {
                throw new UnauthorizedError('Try Logging a  gain, Token not found');
            }

            const decoded = this.jwtService.verifyToken(token);

                      req.body.user = {
                userId: decoded.userId,
                email: decoded.email,
                type: decoded.type
            };

            next();

        }catch (error) {
            Logger.debug("Cookies : ", req.session);
            Logger.error('Token Validation Error', error);

            // res.cookie('token', {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: 'strict'
            // })
            next(error);
        }
    }
}