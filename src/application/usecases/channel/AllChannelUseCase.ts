import { IChannelRepository } from "../../ports/repository/IChannelRepository";

export class AllChannelUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(projectId: string, userIdentifier: string) {
        return await this.channelRepository.findByProject(projectId, userIdentifier);
    }
}