import dotenv from 'dotenv';

dotenv.config();

export class AppConfig {
    readonly port: string;
    readonly env: string;
    readonly mongoConfig: {
        url: string;
        dbName: string;
    };
    readonly redis: {
        url: string;
    };
    readonly auth: {
        sessionSecret: string;
        jwtSecret: string;
        refreshTokenSecret: string;
        jwtExpiresIn: string;
        callbackUrl: string;
    };

    constructor() {
        this.port = process.env.PORT || '4000';
        this.env = process.env.NODE_ENV || 'dev';
        
        this.mongoConfig = {
            url: process.env.MONGO_URL || 'mongodb://localhost:27017',
            dbName: process.env.MONGO_DB_NAME || 'eventdb'
        };

        this.redis = {
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        };

        this.auth = {
            sessionSecret: process.env.SESSION_SECRECT_KEY || 'default_session_secret',
            jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
            refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret',
            jwtExpiresIn: process.env.JWT_SECRET_EXPIRESIN || '1d',
            callbackUrl: process.env.CALL_BACKURL_HOST || 'http://localhost:4000'
        };
    }
}