import { Application } from "express";
import { UserRouter } from "./user/UserRouter";
import { AuthRouter } from "./auth/AuthRouter";
import { ProjectRouter } from "./project/ProjectRouter";
import { ChannelRouter } from "./channel/ChannelRouter";
import { ChannelEventRouter } from "./channelEvent/ChannelEventRouter";

export const configureRoutes = (app: Application) => {
    app.use('/api/v1/users', new UserRouter().getRouter());
    app.use('/api/v1/auth', new AuthRouter().getRouter());
    app.use('/api/v1/projects', new ProjectRouter().getRouter());
    app.use('/api/v1/channel', new ChannelRouter().getRouter());
    app.use('/api/v1/channel/event', new ChannelEventRouter().getRouter());
};