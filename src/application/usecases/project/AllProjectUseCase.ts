import { IProjectRepository } from "../../ports/repository/IProjectRepository";

export class AllProjectUseCase {
    constructor(private readonly projectRepository: IProjectRepository) {}

    async execute(userIdentifier: string) {
        return await this.projectRepository.findByUserId(userIdentifier);
    }
}