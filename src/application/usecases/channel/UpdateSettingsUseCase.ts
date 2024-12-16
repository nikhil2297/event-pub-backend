import { IChannel } from "../../../domain/entities/IChannel";
import { IChannelRepository } from "../../ports/repository/IChannelRepository";
import { ChannelValidator } from "../../validators/ChannelValidator";

export class UpdateSettingsUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(channelName: string, projectId: string, userIdentifier: string, settings: Partial<IChannel['settings']>): Promise<IChannel> {
        try {
            ChannelValidator.validateChannelUpdate(channelName, projectId, settings);
            return await this.channelRepository.updateSettings(channelName, projectId, userIdentifier, settings);
        }catch (error) {
            throw error;
        }
    }

}