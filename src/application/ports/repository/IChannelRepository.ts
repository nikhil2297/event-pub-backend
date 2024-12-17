import { CreateChannelDTO } from "../../../domain/dtos/CreateChannelDTO";
import { IChannel } from "../../../domain/entities/IChannel";

export interface IChannelRepository {
    create(channel: CreateChannelDTO, userIdentifier: string): Promise<IChannel>;
    delete(channelName: string, projectName: string, userIdetifier:string): Promise<void>;
    updateSettings(channelName: string, projectName: string, userIdentifier: string, settings: Partial<IChannel['settings']> ): Promise<IChannel>;
    findByProject(projectName: string, userIdentifier: string): Promise<IChannel[]>;
}