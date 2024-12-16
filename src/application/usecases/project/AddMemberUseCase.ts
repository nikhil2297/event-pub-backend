import { IProjectRepository } from "../../ports/repository/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class AddMemberUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(projectId: string, userIdentifier: string, scope: string, owner: string): Promise<void> {
        try {
            ProjectValidator.validateSetMemberRole(owner, userIdentifier, scope);
            await this.projectRepository.addMember(projectId, userIdentifier, scope);
        }catch (error) {
            throw error;
        }
    }

}