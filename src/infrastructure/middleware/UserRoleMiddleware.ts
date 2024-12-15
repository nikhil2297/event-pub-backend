import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors/ApplicationError";

export const AdminRoleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body.user;
    if(body.scope !== 'ADMIN') {
        return new ForbiddenError('You are not authorized to perform this action');
    }
    next();
}


export const UserEditRoleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body.user;
    if(body.scope !== 'VIEW_EDIT_ONLY' && body.scope !== 'ADMIN') {
        return new ForbiddenError('You are not authorized to perform this action');
    }
    next();
}