export interface CreateChannelEventDTO {
    projectName: string;
    projectId?: string;
    channel: string;
    channelId?: string;
    event: string;
    user_id?: string;
    description: string;
    tags: Record<string, any>;
    notify: boolean;
    metadata?: {
        ip?: string;
        userAgent?: string;
        timestamp: Date;
    }
}