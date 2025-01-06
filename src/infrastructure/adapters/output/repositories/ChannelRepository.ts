import { IChannelRepository } from "../../../../application/ports/repository/IChannelRepository";
import { CreateChannelDTO } from "../../../../domain/dtos/CreateChannelDTO";
import { IChannel } from "../../../../domain/entities/IChannel";
import { IProject } from "../../../../domain/entities/IProject";
import { DatabaseError } from "../../../../shared/errors/ApplicationError";
import { Logger } from "../../../../shared/utils/Logger";
import { ChannelModel } from "../schemas/ChannelSchema";
import { ProjectModel } from "../schemas/ProjectSchema";

export class ChannelRepository implements IChannelRepository {
    async create(channel: CreateChannelDTO, projectId: string, useIdentifier: string): Promise<IChannel> {
        try {
            Logger.info('Creating channel:', channel);
            // const project = await this.getProject(channel.projectId, useIdentifier);

            

            const existingChannel = await ChannelModel.findOne({
                name: channel.name,
                project: projectId,
            });

            if(existingChannel) {
                Logger.error('Channel already exists:', existingChannel);
                throw new DatabaseError(`Channel with ${channel.name} already exists in your project`);
            }

            const newChannel = new ChannelModel({
                name: channel.name,
                projectId: projectId,
                settings: {
                    icon: channel.icon,
                    hidden: false,
                    muted: false,
                }
            });

            const savedChannel = await newChannel.save();

            return savedChannel;
        }catch (error) {
            Logger.error("Error creating channel", error);
            throw new DatabaseError('Error creating channel');
        }
    }

    async delete(channelName: string, projectName: string, userIdentifier: string): Promise<void> {
        try {
            Logger.info(`Deleting channel: ${channelName} from project: ${projectName}`);
            const project = await this.getProject(projectName, userIdentifier);
            await ChannelModel.deleteOne({
                name: channelName,
                project: project._id
            });
        }catch (error) {
            Logger.error("Error deleting channel", error);
            throw new DatabaseError('Error deleting channel');
        }
    }
    async updateSettings(channelName: string, projectName: string, userIdentifier: string, settings: Partial<IChannel["settings"]>): Promise<IChannel> {
        try {
            Logger.info(`Updating channel settings: ${channelName} from project: ${projectName}`);
            
            const project = await this.getProject(projectName, userIdentifier);

            const updateChannel = await ChannelModel.findOneAndUpdate({
                name: channelName,
                projectId: project._id
            },{
                settings
            },{
                new: true
            });

            if(!updateChannel) {
                Logger.error('Channel not found:', updateChannel);
                throw new DatabaseError(`Channel with ${channelName} not found in your project`);
            }

            return updateChannel;
        }catch (error) {
            Logger.error("Error updating channel settings", error);
            throw new DatabaseError('Error updating channel settings');
        }
    }

    async findByProject(projectName: string, userIdentifier: string): Promise<IChannel[]> {
        try {
            Logger.info(`Finding channels by project: ${projectName}`);
            const project = await this.getProject(projectName, userIdentifier);
            const channels = await ChannelModel.find({
                project: project._id
            });
                                                                 
            return channels;
        } catch (error) {
            Logger.error("Error finding channels by project", error);
            throw new DatabaseError('Error finding channels by project');
        }
    }

    private async getProject(projectId : string, userIdentifier: string) : Promise<IProject> {
        try {
        const project = await ProjectModel.findOne({
            _id: projectId,
            $or: [
                { owner: userIdentifier },
                { 'members.identifier': userIdentifier }
            ]
        });

        if(!project) {
            Logger.error('Project not found:', projectId);
            throw new DatabaseError(`Project not found`);
        }

        return project;
        }catch (error) {
            Logger.error("Error getting project", error);
            throw new DatabaseError('Error getting project');
        }
    }  
}