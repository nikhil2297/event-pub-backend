import mongoose, { Schema } from "mongoose";
import { IProject } from "../../../../domain/entities/IProject";

const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    owner: {
        type: String,
        required: true
    },
    members : {
        type: [{
            identifier: {
                type: String,
                required: true
            },
            pending: {
                type: Boolean,
                default: true
            },
            scope: {
                type: String,
                enum: ['VIEW_ONLY', 'VIEW_EDIT_ONLY', 'ADMIN'],
            }
        }],
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);