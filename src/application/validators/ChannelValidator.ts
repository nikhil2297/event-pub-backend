import { CreateChannelDTO } from "../../domain/dtos/CreateChannelDTO";
import { IChannel } from "../../domain/entities/IChannel";
import { ValidationError } from "../../shared/errors/ApplicationError";

export class ChannelValidator {
    
    static validateChannel(channel: CreateChannelDTO) : void {
        if (!channel.name) {
            throw new ValidationError('Channel Name is required');
        }

        if(!channel.projectName) {
            throw new ValidationError('Project Name is required');
        }

        if(!channel.icon) {
            throw new ValidationError('Icon is required');
        }
    }

    static validateChannelUpdate(channelName: string, projectId: string, settings: Partial<IChannel['settings']>) {
        if(!channelName) {
            throw new ValidationError('Channel Name is required');
        }

        if(!projectId) {
            throw new ValidationError('Project ID is required');
        }
    }
}