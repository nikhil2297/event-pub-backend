
export interface IEventStreamService {
    connect(username: string, response: Response): Promise<void>;
    disconnect(username: string): Promise<void>;
}