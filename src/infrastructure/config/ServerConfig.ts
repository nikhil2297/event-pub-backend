import express ,{ Application } from "express";
import { AppConfig } from "./AppConfig";
import compression from 'compression';
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import { errorHandler } from "../middleware/ErrorMiddleware";
import { configureRoutes } from "../adapters/input/route";

export class ServerConfig {
    private app: Application;
    private config: AppConfig;

    constructor() {
        this.app = express();
        this.config = new AppConfig();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddlewares() {   
        //Basic middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cors());

        //Session and Authnetication middlewares
        this.app.use(session({
            secret: this.config.auth.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: this.config.env === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));

        //Passport middlewares
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private setupRoutes() {
        configureRoutes(this.app);
    }

    private setupErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public getApp(): Application {
        return this.app;
    }
}