import { Request, Response, NextFunction } from "express";
import { PassportConfig } from "../config/PassportConfig";
import passport from 'passport';
import { UnauthorizedError } from "../../shared/errors/ApplicationError";

export class PassportMiddleware {
    constructor(private readonly passportConfig: PassportConfig) {}

    authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', {session: false}, (err : any, user : Express.User | null, info : any) => {
            if (err) return next(err);
            if (!user) return next(new UnauthorizedError(info?.message || 'Authentication failed'));
            req.user = user;
            next();
        })(req, res, next);
    }
}   