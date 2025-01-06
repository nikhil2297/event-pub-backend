import mongoose, { Schema } from "mongoose";
import { IApiKey } from "../../../../domain/entities/IApiKey";
import { generateSlug } from "random-word-slugs";

const ApiKeySchema = new Schema<IApiKey>({
    name: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    projectId: {
        type: String,
        required: true,
    },
    channel: {
        type: [{
                channelId: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                selected: {
                    type: Boolean,
                    required: true,
                    default: true
                }
        }],
        required: true
    }
}, {
    timestamps: true,
    toJSON : {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const ApiKeyModel = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);