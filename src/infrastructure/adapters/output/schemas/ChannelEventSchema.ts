import mongoose, { Schema } from "mongoose";
import { IChannelEvent } from "../../../../domain/entities/IChannelEvent";

const ChannelEventSchema = new Schema<IChannelEvent>({
    projectId: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },  
    tags: {
        type: Map,
        required: true
    },
    notify: {
        type: Boolean,
        required: true
    },
    metadata: {
        type: {
            ip: {
                type: String,
                required: false
            },
            userAgent: {
                type: String,
                required: false
            },
            timestamp: {
                type: Date,
                required: true
            }
        },
        required: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret._projectId = ret.projectId;
            ret._channelId = ret.channelId;
            delete ret._projectId;
            delete ret._channelId;
            delete ret.__v;
        }
    }
});


export const ChannelEventModel = mongoose.model<IChannelEvent>('ChannelEvent', ChannelEventSchema);