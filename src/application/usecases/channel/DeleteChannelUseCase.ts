import { IChannelRepository } from "../../ports/repository/IChannelRepository";

export class DeleteChannelUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(channelId: string, projectName: string, userIdenfier:string): Promise<void> {
        try {
            await this.channelRepository.delete(channelId, projectName, userIdenfier);
        }catch (error) {
            throw error;
        }
    }
}