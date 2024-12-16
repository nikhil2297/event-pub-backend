import { createClient, RedisClientType } from "redis";
import { IRedisService } from "../../application/ports/service/IRedisService";
import { Logger } from "../../shared/utils/Logger";
import { ConnectionError } from "../../shared/errors/ApplicationError";

export class RedisService implements IRedisService {
    private pubClient: RedisClientType;
    private subClient: RedisClientType;

    constructor(redisUrl: string) {
        this.pubClient = createClient({ url: redisUrl });
        this.subClient = createClient({ url: redisUrl });

        this.setupErrorHandlers();
    }

    private setupErrorHandlers(): void {
        this.pubClient.on('error', (err) => {
            Logger.error('Redis Publishing Error:', err);
        });

        this.subClient.on('error', (err) => {
            Logger.error('Redis Subscription Error:', err);
        });
    }

    async connect(): Promise<void> {
        try {
            await Promise.all([
                this.pubClient.connect(),
                this.subClient.connect()
            ]);
            Logger.info('Redis clients connected successfully');
        } catch (error) {
            Logger.error('Redis connection error:', error as Error);
            throw new ConnectionError('Failed to connect to Redis');
        }
    }

    async disconnect(): Promise<void> {
        await Promise.all([
            this.pubClient.quit(),
            this.subClient.quit()
        ]);
    }

    async publish(channel: string, message: any): Promise<void> {
        await this.pubClient.publish(channel, JSON.stringify(message));
    }

    async subscribe(channel: string, callback: (message: any, channel: string) => void): Promise<void> {
        await this.subClient.subscribe(channel, (message, channel) => {
            callback(JSON.parse(message), channel);
        });
    }

    async unsubscribe(channel: string): Promise<void> {
        await this.subClient.unsubscribe(channel);
    }

    async getActiveChannels(): Promise<string[]> {
        return await this.pubClient.pubSubChannels('*');
    }
}