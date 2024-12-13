import { Response } from "express";

export interface ISSEService {
    initializeConnection(username: string, res: Response): void;
    closeConnection(username: string): void;
    broadcastToUsers(usernames: string[], data: any): Promise<void>;
}