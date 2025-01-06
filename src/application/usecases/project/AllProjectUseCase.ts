import { INotificationMessage } from "../../../domain/entities/INotificationMessage";
import { NotificationService } from "../../../infrastructure/services/NotificationService";
import { IProjectRepository } from "../../ports/repository/IProjectRepository";

export class AllProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(userIdentifier: string) {
        return await this.projectRepository.findByUserId(userIdentifier);
    }
}