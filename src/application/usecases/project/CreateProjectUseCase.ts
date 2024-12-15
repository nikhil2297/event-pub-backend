import { CreateProjectDTO } from "../../../domain/dtos/CreatePorjectDTO";
import { ProjectModel } from "../../../infrastructure/adapters/output/schemas/ProjectSchema";
import { ConnectionError, ValidationError } from "../../../shared/errors/ApplicationError";
import { Logger } from "../../../shared/utils/Logger";
import { IProjectRepository } from "../../ports/IProjectRepository";
import { ProjectValidator } from "../../validators/ProjectValidator";

export class CreateProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}
    
    async execute(data: CreateProjectDTO) {
        ProjectValidator.validateCreateProject(data);

        const existingProject = await ProjectModel.findOne({
            name: data.name,
            owner: data.owner
        });

        if(existingProject) {
            Logger.error('Project already exists:', existingProject);
            throw new ValidationError(`Project with ${data.name} already exists in your account`);
        }

        try {
            const project = await this.projectRepository.create(data);
            return project;
        } catch (error) {
            throw new ConnectionError('Failed to create user');
            }
    }
}