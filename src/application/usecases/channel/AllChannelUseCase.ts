import { IChannelRepository } from "../../ports/repository/IChannelRepository";

export class AllChannelUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(projectName: string, userIdentifier: string) {
        return await this.channelRepository.findByProject(projectName, userIdentifier);
    }
}