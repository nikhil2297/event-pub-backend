export interface CreateChannelEventDTO {
    projectName?: string;
    projectId?: string;
    channelName: string;
    channelId?: string;
    icon?: string;
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