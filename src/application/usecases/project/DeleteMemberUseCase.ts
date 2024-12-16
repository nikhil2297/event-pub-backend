import { IProjectRepository } from "../../ports/repository/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class DeleteMemberUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(projectId: string, userIdentifier: string, owner: string): Promise<void> {
        try {
            ProjectValidator.validateSetMemberRole(owner, userIdentifier, '');
            await this.projectRepository.removeMember(projectId, userIdentifier);
        }catch (error) {
            throw error;
        }
    }
}