import { IChannelEventRepository } from "../../ports/repository/IChannelEventRepository";

export class DeleteChannelEventUseCase {
    constructor(private channelEventRepository: IChannelEventRepository) {}
    
    async execute(eventId: string, projectId: string): Promise<void> {
        await this.channelEventRepository.deleteChannelEvent(eventId, projectId);
    }
}