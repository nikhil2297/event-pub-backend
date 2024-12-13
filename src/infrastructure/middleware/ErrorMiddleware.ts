import { Request, Response, NextFunction } from "express";
import { Logger } from "../../shared/utils/Logger";
import { BaseError } from "../../shared/errors/BaseError";
import { AppConfig } from "../config/AppConfig";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error(`Error Processing Request : ${err.message}`, err);

    const config = new AppConfig();

    if(err instanceof BaseError) {
        return res.status(err.statusCode).json({
            sucess: false,
            code: err.code,
            message: err.message,
            ...(config.env === 'dev' && {stack: err.stack})
        })
    }

    //Default error
    return res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        ...(config.env === 'dev' && { stack: err.stack })
    });
}