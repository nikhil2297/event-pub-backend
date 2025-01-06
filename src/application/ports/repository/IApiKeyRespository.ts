import { CreateApiKeyDTO } from "../../../domain/dtos/CreateApiKeyDTO";
import { IApiKey } from "../../../domain/entities/IApiKey";

export interface IApiKeyRespository {
    createToken(data: CreateApiKeyDTO) : Promise<IApiKey>;
    deleteToken(token: string) : Promise<void>;
    validate(token: string, projectId: string) : Promise<boolean>;
}