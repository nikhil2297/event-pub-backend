import { IChannelEventRepository } from "../../../../application/ports/repository/IChannelEventRepository";
import { CreateChannelEventDTO } from "../../../../domain/dtos/CreateChannelEventDTO";
import { IChannelEvent } from "../../../../domain/entities/IChannelEvent";
import { DatabaseError } from "../../../../shared/errors/ApplicationError";
import { Logger } from "../../../../shared/utils/Logger";
import { ChannelEventModel } from "../schemas/ChannelEventSchema";
import { ChannelModel } from "../schemas/ChannelSchema";

export class ChannelEventRepository implements IChannelEventRepository {
    async createChannelEvent(event: CreateChannelEventDTO, projectId: string): Promise<IChannelEvent> {
        try {

            Logger.info('Creating channel event:', event);
            const channelId = await this.getChannelId(event.channel, projectId);
            
            event.projectId = projectId;
            event.channelId = channelId;

            const channelEvent = new ChannelEventModel(event);
            const savedChannelEvent = await channelEvent.save();
            return savedChannelEvent;
        } catch (error) {
            Logger.error("Error creating channel event", error);
            throw new DatabaseError('Error creating channel event');
        }
    }

    async getChannelEvents(channelName: string, projectId: string): Promise<IChannelEvent[]> {
        try {
            const channelId = await this.getChannelId(channelName, projectId);
            const channelEvents = await ChannelEventModel.find({ channelId: channelId, projectId: projectId });
            return channelEvents;
        } catch (error) {
            Logger.error("Error getting channel events", error);
            throw new DatabaseError('Error getting channel events');
        }
    }
    async filterChannelEvents(channelName: string, searchFilter: string, projectId: string): Promise<IChannelEvent[]> {
        try {
            const channelId = await this.getChannelId(channelName, projectId);
            const channelEvents = await ChannelEventModel.find({
                channelId: channelId,
                projectId: projectId,
                $or: [
                    { description: { $regex: searchFilter, $options: 'i' } },
                    { event: { $regex: searchFilter, $options: 'i' } },
                    { 'tags.value': { $regex: searchFilter, $options: 'i' } }
                ]
            });
            return channelEvents;
        } catch (error) {
            Logger.error("Error filtering channel events", error);
            throw new DatabaseError('Error filtering channel events');
        }
    }

    async deleteChannelEvent(eventId: string, projectId: string): Promise<void> {
        try {
            await ChannelEventModel.deleteOne({ id: eventId, projectId: projectId });
        } catch (error) {
            Logger.error("Error deleting channel event", error);
            throw new DatabaseError('Error deleting channel event');
        }
    }

    private async getChannelId(channelName: string, projectId: string): Promise<string> {
        const channel = await ChannelModel.findOne({ name: channelName, projectId: projectId });
        if (!channel) {
            throw new DatabaseError('Channel not found');
        }
        return channel.id;
    }
}