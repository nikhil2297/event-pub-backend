import { IChannel } from "../../../domain/entities/IChannel";
import { IChannelRepository } from "../../ports/repository/IChannelRepository";
import { ChannelValidator } from "../../validators/ChannelValidator";

export class UpdateSettingsUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(channelName: string, projectName: string, userIdentifier: string, settings: Partial<IChannel['settings']>): Promise<IChannel> {
        try {
            ChannelValidator.validateChannelUpdate(channelName, projectName, settings);
            return await this.channelRepository.updateSettings(channelName, projectName, userIdentifier, settings);
        }catch (error) {
            throw error;
        }
    }

}