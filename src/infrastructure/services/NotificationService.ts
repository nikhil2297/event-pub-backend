import { INotificationService } from "../../application/ports/service/INotificationService";
import { IRedisService } from "../../application/ports/service/IRedisService";
import { INotificationMessage } from "../../domain/entities/INotificationMessage";
import { Logger } from "../../shared/utils/Logger";
import { NotificationType } from "../../shared/utils/NotificationType";
import { RedisService } from "./RedisService";

export class NotificationService implements INotificationService {
    constructor() {
    }

    async notifyUsers<T>(usernames: string[], notificationType: NotificationType,  message: INotificationMessage<T>): Promise<void> {
          try {
            const activeSubscribers = await this.getActiveSubscribers();
            
            for (const username of usernames) {
                if (activeSubscribers.includes(username)) {
                    await RedisService.getInstance().publish(username, notificationType, message);
                }
            }
        } catch (error) {
            Logger.error('Failed to notify users:', error as Error);
            throw error;
        }
    }
    async getActiveSubscribers(): Promise<string[]> {
                return await RedisService.getInstance().getActiveChannels();
    }

    
}