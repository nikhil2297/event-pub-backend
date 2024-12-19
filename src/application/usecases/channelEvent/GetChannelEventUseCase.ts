import { IChannelEvent } from "../../../domain/entities/IChannelEvent";
import { IChannelEventRepository } from "../../ports/repository/IChannelEventRepository";

export class GetChannelEventUseCase {
    constructor(private readonly channelEventRepository: IChannelEventRepository) {}

    async execute(channelName: string, projectId: string): Promise<IChannelEvent[]> {
        return this.channelEventRepository.getChannelEvents(channelName, projectId);
    }
}  