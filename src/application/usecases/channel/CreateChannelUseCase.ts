import { CreateChannelDTO } from "../../../domain/dtos/CreateChannelDTO";
import { IChannel } from "../../../domain/entities/IChannel";
import { IChannelRepository } from "../../ports/repository/IChannelRepository";
import { ChannelValidator } from "../../validators/ChannelValidator";

export class CreateChannelUseCase {
    constructor(private readonly channelRepository: IChannelRepository) {}

    async execute(data: CreateChannelDTO, userIdenfier: string): Promise<IChannel> {
        try {
            ChannelValidator.validateChannel(data);
            return await this.channelRepository.create(data, userIdenfier);
        }catch (error) {
            throw error;
        }
    }
}