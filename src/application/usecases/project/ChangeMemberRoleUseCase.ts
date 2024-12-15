import { IProjectRepository } from "../../ports/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class ChangeMemberRoleUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(projectId: string, userIdentifier: string, role: string, owner: string): Promise<void> {
        try {
            ProjectValidator.validateSetMemberRole(owner, userIdentifier, role);
            await this.projectRepository.changeMemberRole(projectId, userIdentifier, role);
        }catch (error) {
            throw error;
        }
    }

}