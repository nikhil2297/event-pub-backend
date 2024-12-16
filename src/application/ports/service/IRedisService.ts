export interface IRedisService {
    publish(channel: string, message: any): Promise<void>;
    subscribe(channel: string, callback: (message: any, channel: string) => void): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
    getActiveChannels(): Promise<string[]>;
}