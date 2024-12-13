import { Application } from "express";
import { UserRouter } from "./user/UserRouter";
import { AuthRouter } from "./auth/AuthRouter";

export const configureRoutes = (app: Application) => {
    app.use('/api/v1/users', new UserRouter().getRouter());
    app.use('/api/v1/auth', new AuthRouter().getRouter());
};