import mongoose, { Connection } from "mongoose";
import { AppConfig } from "../config/AppConfig";

export class MongoConnection {
    private config: AppConfig;
    private static instance: MongoConnection;

    private constructor() {
        this.config = new AppConfig();
        this.handleConnection();
    }

    public static getInstance(): MongoConnection {
        if (!MongoConnection.instance) {
            MongoConnection.instance = new MongoConnection();
        }
        return MongoConnection.instance
    }

    private handleConnection(): void {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('❗ MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });    
    }

    public async connect(): Promise<Connection> {
        try {
            if (!mongoose.connection.readyState) {
                await mongoose.connect(this.config.mongoConfig.url, {
                    dbName: this.config.mongoConfig.dbName,
                });
            }
            return mongoose.connection;
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw new Error('Database connection failed');
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.connection.close();
            console.log('MongoDB disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    public getConnection(): Connection {
        return mongoose.connection;
    }
}