import { Router } from "express";
import { ChannelEventController } from "./ChannelEventController";
import { ChannelEventRepository } from "../../output/repositories/ChannelEventRepository";
import { TokenMiddleware } from "../../../middleware/TokenMiddleware";
import { AdminRoleMiddleware } from "../../../middleware/UserRoleMiddleware";

export class ChannelEventRouter {
    private router: Router;
    private channelEventController: ChannelEventController;

    constructor() {
        this.router = Router();
        this.channelEventController = new ChannelEventController(new ChannelEventRepository());
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //TODO: Add middleware to validate the api token for create request
        this.router.post('/create', this.channelEventController.create.bind(this.channelEventController));
        this.router.get('/get', TokenMiddleware.validateToken,  this.channelEventController.getAll.bind(this.channelEventController));
        this.router.get('/filter', TokenMiddleware.validateToken, this.channelEventController.filterEvents.bind(this.channelEventController));
        this.router.delete('/delete', TokenMiddleware.validateToken,  AdminRoleMiddleware,  this.channelEventController.delete.bind(this.channelEventController));
    }
        getRouter(): Router {
        return this.router;
    }            
}