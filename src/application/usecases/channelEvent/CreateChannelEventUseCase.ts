import { CreateChannelEventDTO } from "../../../domain/dtos/CreateChannelEventDTO";
import { IChannelEventRepository } from "../../ports/repository/IChannelEventRepository";

export class CreateChannelEventUseCase {
    constructor(private channelEventRepository: IChannelEventRepository) {}

    async execute(event: CreateChannelEventDTO, projectId: string) {
        return await this.channelEventRepository.createChannelEvent(event, projectId);
    }
}