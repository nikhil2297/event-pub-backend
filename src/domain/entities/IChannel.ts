export interface IChannel {
    id: string;
    name: string;
    projectId: string;
    settings: {
        hidden: boolean;
        muted: boolean;
        icon: string;
    }
    createdAt: Date;
    updatedAt: Date;
}