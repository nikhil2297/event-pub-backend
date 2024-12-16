import { Response } from "express";
import { ISSEService } from "../../../../application/ports/service/ISSEService";
import { IRedisService } from "../../../../application/ports/service/IRedisService";
import { Logger } from "../../../../shared/utils/Logger";

export class SSEService implements ISSEService {
    constructor(private redisService: IRedisService) {}
    async initializeConnection(username: string, res: Response): Promise<void> {
        try {
            this.setupSSEHeaders(res);

            await this.redisService.subscribe(username, (message, channel) => {
                const response = {
                    status: 200,
                    data: message
                };
                res.write(JSON.stringify(response));
            });

        } catch (error) {
            Logger.error(`SSE connection error for user ${username}:`, error as Error);
            res.end();
        }
    }
    async closeConnection(username: string): Promise<void> {
        await this.redisService.unsubscribe(username);
    }

    async broadcastToUsers(usernames: string[], data: any): Promise<void> {
        const activeChannels = await this.redisService.getActiveChannels();
        
        for (const username of usernames) {
            if (activeChannels.includes(username)) {
                await this.redisService.publish(username, data);
            }
        }    
    }

   
    private setupSSEHeaders(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
    }
}