import { INotificationMessage } from "../../../domain/entities/INotificationMessage";
import { NotificationType } from "../../../shared/utils/NotificationType";

export interface INotificationService {
    notifyUsers<T>(usernames: string[], notificationType: NotificationType,  message: INotificationMessage<T>): Promise<void>;
    getActiveSubscribers(): Promise<string[]>;
}