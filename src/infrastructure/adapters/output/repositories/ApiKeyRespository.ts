import { generateSlug } from "random-word-slugs";
import { IApiKeyRespository } from "../../../../application/ports/repository/IApiKeyRespository";
import { CreateApiKeyDTO } from "../../../../domain/dtos/CreateApiKeyDTO";
import { IApiKey } from "../../../../domain/entities/IApiKey";
import { DatabaseError } from "../../../../shared/errors/ApplicationError";
import { Logger } from "../../../../shared/utils/Logger";
import { ApiKeyModel } from "../schemas/ApiKeySchema";

export class ApiKeyRepository implements IApiKeyRespository {
    async createToken(data: CreateApiKeyDTO): Promise<IApiKey> {
        try {
            Logger.info('Creating token:', data);
            data.name = `${generateSlug(1, {
          format: "lower",
          partsOfSpeech: ["adjective", "noun", "adjective"],
          categories: {
            adjective: ["color", "appearance", "personality"],
            noun: ["animals"],
          },
        }) + "-" + "token"}`
            const apiKey = new ApiKeyModel(data);
            return await apiKey.save();
        } catch (error) {
            Logger.error("Error creating token", error);
            throw new DatabaseError('Error creating token');
        }
    }

    async validate(token: string, projectId: string): Promise<boolean> {
        try {
            Logger.info('Validating token: ' + token );
            const apiKey = await ApiKeyModel.findOne({ token, projectId });

            if (!apiKey) {
                return false;
            }

            return true;

        } catch (error) {
            Logger.error("Error validating token", error);
            throw new DatabaseError('Error validating token');
        }
    }

    async deleteToken(token: string): Promise<void> {
        try {
            Logger.info('Deleting token: ' + token );
            const apiKeyModel = new ApiKeyModel();
            await await apiKeyModel.deleteOne({ token: token });
        } catch (error) {
            Logger.error("Error deleting token", error);
            throw new DatabaseError('Error deleting token');
        }
    }
    
}