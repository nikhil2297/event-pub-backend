import { IChannelEvent } from "../../../domain/entities/IChannelEvent";
import { IChannelEventRepository } from "../../ports/repository/IChannelEventRepository";

export class FilterChannelEventsUseCase {
    constructor(private readonly channelEventRepository: IChannelEventRepository) {}

    async execute(channelName: string, searchFilter: string, projectId: string): Promise<IChannelEvent[]> {
        return this.channelEventRepository.filterChannelEvents(channelName, searchFilter, projectId);
    }
}