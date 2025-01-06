import { Request, Response, NextFunction } from "express";
import { IApiKeyRespository } from "../../application/ports/repository/IApiKeyRespository";
import { ApiKeyRepository } from "../adapters/output/repositories/ApiKeyRespository";
import { Logger } from "../../shared/utils/Logger";
import { UnauthorizedError } from "../../shared/errors/ApplicationError";

export class ApiKeyMiddleware {
    private static readonly apiRespository : IApiKeyRespository = new ApiKeyRepository();

    static validate = async  (req: Request, res: Response, next: NextFunction) => {
        try {
            Logger.debug("Headers : ", req.headers);

            const apiKey = req.headers['api-key'] as string;

            if(!apiKey) {
                throw new UnauthorizedError('Check if you have an api key is valid');
            }

            const projectId = req.params.projectId as string;

            this.apiRespository.validate(apiKey, projectId).then((isValid) => {
                if(!isValid) {
                    throw new UnauthorizedError('Invalid Api Key');
                }
                
                next();
            }, (error) => {
                throw new UnauthorizedError('Invalid Api Key');
            });

        } catch (error) {
            Logger.error('Api Key Validation Error', error);
            next(error);
        }
    }
}