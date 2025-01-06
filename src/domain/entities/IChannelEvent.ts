export interface IChannelEvent {
    _id: string;
    projectId: string;
    projectName: string;
    channelId: string;
    channelName: string;
    icon: string;
    event: string;
    userId?: string;
    description: string;
    tags: Record<string, any>;
    notify: boolean;
    metadata?: {
        ip?: string;
        userAgent?: string;
        timestamp: Date;
    }
} 