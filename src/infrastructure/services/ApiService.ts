import { generateApiKey } from 'generate-api-key';
import { DatabaseError } from '../../shared/errors/ApplicationError';
import { Logger } from '../../shared/utils/Logger';

export class ApiKeyService {

    static createApiKey(length: number) : any {
        try {
            const apiKey = generateApiKey({ method: 'bytes', min: length });
        return apiKey;
        }catch (error : any) {
            Logger.error('Error generating API key:', error);
            throw new DatabaseError(error);
        }
    }
}