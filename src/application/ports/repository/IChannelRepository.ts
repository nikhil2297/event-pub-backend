import { CreateChannelDTO } from "../../../domain/dtos/CreateChannelDTO";
import { IChannel } from "../../../domain/entities/IChannel";

export interface IChannelRepository {
    create(channel: CreateChannelDTO): Promise<IChannel>;
    delete(channelName: string, projectId: string): Promise<void>;
    updateSettings(channelName: string, projectId: string, userIdentifier: string, settings: Partial<IChannel['settings']> ): Promise<IChannel>;
    findByProject(projectId: string, userIdentifier: string): Promise<IChannel[]>;
}