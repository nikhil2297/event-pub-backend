import { Router } from "express";
import { IUserRepository } from "../../../../application/ports/IUserRepository";
import { UserRepository } from "../../output/repositories/UserRepository";
import { PassportMiddleware } from "../../../middleware/PassportMiddleware";
import { AuthController } from "./AuthController";
import { PassportConfig } from "../../../config/PassportConfig";

export class AuthRouter {
    private router: Router;
    private authController: AuthController;
    private passportMiddleware: PassportMiddleware

    constructor() {
        this.router = Router();
        const repo = new UserRepository();
        this.authController = new AuthController(repo);
        this.passportMiddleware = new PassportMiddleware(new PassportConfig(repo));
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post('/login', this.passportMiddleware.authenticateLocal,  this.authController.signIn.bind(this.authController));

        this.router.post('/register', this.authController.signup.bind(this.authController));

        this.router.post('/logout', (req, res) => {
            res.send('Logout');
        });
    }

    getRouter(): Router {
        return this.router;
    }
}