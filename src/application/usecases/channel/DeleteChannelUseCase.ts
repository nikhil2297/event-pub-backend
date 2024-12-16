import { IChannelRepository } from "../../ports/repository/IChannelRepository";

export class DeleteChannelUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(channelId: string, projectId: string): Promise<void> {
        try {
            await this.channelRepository.delete(channelId, projectId);
        }catch (error) {
            throw error;
        }
    }
}