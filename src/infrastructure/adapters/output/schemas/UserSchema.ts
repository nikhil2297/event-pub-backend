import mongoose, { Schema } from "mongoose";
import { IUser } from "../../../../domain/entities/IUser";

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // googleId: {
    //     type: String,
    //     unique: true,
    //     sparse: true,
    //     partialFilterExpression: { googleId: { $exists: true, $ne: null } }
    // },
    accountType: {
        type: String,
        required: true,
        enum: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
        default: 'FREE'
    },
    name: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret._id = ret.id;
            delete ret.id;
            delete ret.__v;
            delete ret.password;

            return ret;
        }
    }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);