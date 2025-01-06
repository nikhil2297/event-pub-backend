import { AppConfig } from "./infrastructure/config/AppConfig";
import { ServerConfig } from "./infrastructure/config/ServerConfig";
import { MongoConnection } from "./infrastructure/database/MongoConnection";
import { SSEService } from './infrastructure/adapters/input/sse/SSEService';
import { RedisService } from './infrastructure/services/RedisService';
import { Logger } from './shared/utils/Logger';

export class Application {
    private readonly config: AppConfig;
    private readonly server: ServerConfig;
    private readonly database: MongoConnection;
    private redisService: RedisService;
    private sseService: SSEService;

    constructor() {
        this.config = new AppConfig();
        this.server = new ServerConfig();
        this.database = MongoConnection.getInstance();
        this.redisService = RedisService.getInstance(this.config.redis.url);
        this.sseService = new SSEService(this.redisService);
    }

    private async initializeServices(): Promise<void> {
        try {        
            // Connect to MongoDB
            await this.database.connect();
            Logger.info('MongoDB connected successfully');

            // Connect to Redis
            await this.redisService.initialize();
            Logger.info('Redis connected successfully');

            // Initialize SSE Service
            this.sseService = new SSEService(this.redisService);
            Logger.info('SSE Service initialized');

        } catch (error) {
            Logger.error('Failed to initialize services:', error as Error);
            throw error;
        }
    }

    private setupGracefulShutdown(): void {
        const shutdown = async () => {
            Logger.info('Shutting down application...');
            
            try {
                await this.redisService.disconnect();
                await this.database.disconnect();
                
                Logger.info('Graceful shutdown completed');
                process.exit(0);
            } catch (error) {
                Logger.error('Error during shutdown:', error as Error);
                process.exit(1);
            }
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }

    public async start(): Promise<void> {
        try {
            await this.initializeServices();
            this.setupGracefulShutdown();

            const app = this.server.getApp();
            
            app.listen(this.config.port, () => {
                Logger.info(`🚀 Server running on port ${this.config.port}`);
                Logger.info('✨ SSE Service ready');
                Logger.info('📱 Redis connection established');
                Logger.info('💾 MongoDB connected');
            });

        } catch (error) {
            Logger.error('Application failed to start:', error as Error);
            throw error;
        }
    }

    public getSSEService(): SSEService {
        return this.sseService;
    }

    public getRedisService(): RedisService {
        return this.redisService;
    }
}