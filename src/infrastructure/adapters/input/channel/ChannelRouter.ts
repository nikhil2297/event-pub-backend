import { Router } from "express";
import { ChannelController } from "./ChannelController";
import { ChannelRepository } from "../../output/repositories/ChannelRepository";
import { TokenMiddleware } from "../../../middleware/TokenMiddleware";
import { AdminRoleMiddleware } from "../../../middleware/UserRoleMiddleware";

export class ChannelRouter {
    private router: Router;
    private channelController: ChannelController;

    constructor() {
        this.router = Router();
        this.channelController = new ChannelController(new ChannelRepository());
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/create/:projectId', TokenMiddleware.validateToken ,this.channelController.create.bind(this.channelController));
        this.router.post('/delete/:projectId', TokenMiddleware.validateToken, AdminRoleMiddleware, this.channelController.delete.bind(this.channelController));
        this.router.post('/update-settings/:projectId', TokenMiddleware.validateToken, AdminRoleMiddleware, this.channelController.updateSettings.bind(this.channelController));
        this.router.post('/all/:projectId', TokenMiddleware.validateToken, AdminRoleMiddleware, this.channelController.getAll.bind(this.channelController));
    }

        getRouter(): Router {
        return this.router;
    }
}