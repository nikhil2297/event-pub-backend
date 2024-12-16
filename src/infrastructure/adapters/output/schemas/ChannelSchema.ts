import mongoose, { Schema } from "mongoose";
import { IChannel } from "../../../../domain/entities/IChannel";

const ChannelSchema = new Schema<IChannel>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    projectId: {
        type: String,
        required: true
    },
    settings: {
        type: {
            hidden: {
                type: Boolean,
                default: false
            },
            muted: {
                type: Boolean,
                default: false
            },
            icon: {
                type: String,
                required: true
            }
        },
    }
}, {
    timestamps: true
})

export const ChannelModel = mongoose.model<IChannel>('Channel', ChannelSchema);