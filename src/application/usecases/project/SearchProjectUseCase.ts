import { IProject } from "../../../domain/entities/IProject";
import { IProjectRepository } from "../../ports/repository/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class SearchProjectUseCase {
    constructor(private projectRepository: IProjectRepository) {}

    async execute(name: string, userIdentifier: string): Promise<IProject[]> {
        try {
            ProjectValidator.projectNameValidator(name);
            const projects = await this.projectRepository.findByName(name, userIdentifier);
            return projects;
        }catch (error) {
            throw error;
        }
    }
}