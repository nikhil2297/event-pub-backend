import { IChannelEvent } from "../../../domain/entities/IChannelEvent";
import { IChannelEventRepository } from "../../ports/repository/IChannelEventRepository";

export class GetAllChannelEventUseCase {
    constructor(private readonly channelEventRepository: IChannelEventRepository) {}

    async execute(projectId: string): Promise<IChannelEvent[]> {
        return this.channelEventRepository.allChannelEvents(projectId);
    }
}  