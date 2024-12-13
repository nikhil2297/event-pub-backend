import { Router } from "express";

export class UserRouter {
    private router: Router;
    
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get('/', (req, res) => {
            res.send('Hello World');
        });
    }

    getRouter(): Router {
        return this.router;
    }
}