import { CreateChannelEventDTO } from "../../../domain/dtos/CreateChannelEventDTO";
import { IChannelEvent } from "../../../domain/entities/IChannelEvent";

export interface IChannelEventRepository {
    createChannelEvent(event: CreateChannelEventDTO, projectId: string): Promise<IChannelEvent>;
    getChannelEvents(channelName: string, projectId: string): Promise<IChannelEvent[]>;
    allChannelEvents(projectId: string): Promise<IChannelEvent[]>;
    filterChannelEvents(channelName: string, searchFilter: string, projectId: string): Promise<IChannelEvent[]>;
    deleteChannelEvent(eventId: string, projectId: string): Promise<void>;
}