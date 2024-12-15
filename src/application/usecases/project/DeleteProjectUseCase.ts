import { IProjectRepository } from "../../ports/IProjectRepository";

export class DeleteProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(projectId: string): Promise<void> {
        try {
            await this.projectRepository.delete(projectId);
        }catch (error) {
            throw error;
        }
    }

}