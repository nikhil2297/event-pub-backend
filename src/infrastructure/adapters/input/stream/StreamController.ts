import { Request, Response, NextFunction, response } from "express";
import { RedisService } from "../../../services/RedisService";
import { Logger } from "../../../../shared/utils/Logger";

export class StreamController {
    async connect(req: Request, res: Response, next: NextFunction) {
        try {
            this.setupSSEHeaders(res);

            const user = req.body.user;

            if (!user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Sending initial connection success message
            res.write(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`);

            // Setup Redis subscription
            await RedisService.getInstance().subscribe(user.userId, (message, channel) => {
                if (res.writableEnded) {
                    // Clean up if connection is closed
                    RedisService.getInstance().unsubscribe(user.userId);
                    return;
                }
                Logger.info(`Sending message to user ${channel}:`, message); 

                res.write(`data: ${JSON.stringify(message)}\n\n`);
            });

            req.on('close', async () => {
                await RedisService.getInstance().unsubscribe(user.userId);
                Logger.info(`Stream disconnected for user ${user.userId}`);
            });

        } catch (error) {
            Logger.error(`Stream connection error for user:`, error as Error);
            res.end();
            next(error);
        }
    }

    async disconnect(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body.user;

            if (!user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            await RedisService.getInstance().unsubscribe(user.userId);
            res.json({ message: 'Stream disconnected successfully' });

        } catch (error) {
            Logger.error(`Stream disconnection error for user:`, error as Error);
            next(error);
        }
    }

    private setupSSEHeaders(res: Response): void {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Encoding': 'none',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Credentials': 'true'
        });
    }
}
