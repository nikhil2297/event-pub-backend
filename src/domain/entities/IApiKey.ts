export interface IApiKey {
    _id: string;
    name: string;
    token: string;
    projectId: string;
    channel: {
        channelId: string;
        name: string;
        selected: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}