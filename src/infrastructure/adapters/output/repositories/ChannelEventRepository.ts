import { IChannelEventRepository } from "../../../../application/ports/repository/IChannelEventRepository";
import { CreateChannelEventDTO } from "../../../../domain/dtos/CreateChannelEventDTO";
import { IChannel } from "../../../../domain/entities/IChannel";
import { IChannelEvent } from "../../../../domain/entities/IChannelEvent";
import { INotificationMessage } from "../../../../domain/entities/INotificationMessage";
import { DatabaseError } from "../../../../shared/errors/ApplicationError";
import { Logger } from "../../../../shared/utils/Logger";
import { NotificationType } from "../../../../shared/utils/NotificationType";
import { NotificationService } from "../../../services/NotificationService";
import { ChannelEventModel } from "../schemas/ChannelEventSchema";
import { ChannelModel } from "../schemas/ChannelSchema";
import { ProjectModel } from "../schemas/ProjectSchema";

export class ChannelEventRepository implements IChannelEventRepository {
    async createChannelEvent(event: CreateChannelEventDTO, projectId: string): Promise<IChannelEvent> {
        try {

            Logger.info('Creating channel event:', event);
            
            const project = await ProjectModel.findById(projectId);

            if (!project) {
                throw new DatabaseError('Project not found');
            }

            const channelId = await this.getChannelId(event.channelName, projectId);
            
            event.projectId = projectId;
            event.projectName = project.name;
            event.channelId = channelId._id;
            event.icon = channelId.settings.icon;

            const channelEvent = new ChannelEventModel(event);
            const savedChannelEvent = await channelEvent.save();

            const members : string[] = project.members.map(member => member.identifier);
            const notification = new NotificationService();

            const notificationMessage : INotificationMessage<IChannelEvent> = {
                data: savedChannelEvent,
            }


            notification.notifyUsers(members, NotificationType.CHANNEL, notificationMessage );

            return savedChannelEvent;
        } catch (error) {
            Logger.error("Error creating channel event", error);
            throw new DatabaseError('Error creating channel event');
        }
    }

    async getChannelEvents(channelName: string, projectId: string): Promise<IChannelEvent[]> {
        try {
            // const channelId = await this.getChannelId(channelName, projectId);
            const channelEvents = await ChannelEventModel.find({ channelName: channelName, projectId: projectId });
            return channelEvents;
        } catch (error) {
            Logger.error("Error getting channel events", error);
            throw new DatabaseError('Error getting channel events');
        }
    }

    async allChannelEvents(projectId: string): Promise<IChannelEvent[]> {
        try {
            const channelEvents = await ChannelEventModel.find({ projectId: projectId }, null, { sort: { createdAt: -1 } });
            if (!channelEvents || channelEvents.length === 0) {
                return [];
            }
            return channelEvents;
        }  catch (error) {
            Logger.error("Error getting all channel events", error);
            throw new DatabaseError('Error getting all channel events');
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

    private async getChannelId(channelName: string, projectId: string): Promise<IChannel> {
        const channel = await ChannelModel.findOne({ name: channelName, projectId: projectId });
        if (!channel) {
            throw new DatabaseError('Channel not found');
        }
        return channel;
    }
}