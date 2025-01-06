import { Router } from "express";
import { StreamController } from "./StreamController";
import { TokenMiddleware } from "../../../middleware/TokenMiddleware";

export class StreamRouter {
    private router : Router;
    private   streamController : StreamController;
    
    constructor() {
        this.router = Router();
        this.streamController = new StreamController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/connect', TokenMiddleware.validateToken, this.streamController.connect.bind(this.streamController));
        this.router.get('/disconnect', TokenMiddleware.validateToken, this.streamController.disconnect.bind(this.streamController));
    }

    getRouter(): Router {
        return this.router;
    }
}