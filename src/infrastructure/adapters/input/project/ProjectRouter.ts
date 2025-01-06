import { Router } from "express";
import { ProjectController } from "./ProjectController";
import { ProjectRepository } from "../../output/repositories/ProjectRepository";
import { TokenMiddleware } from "../../../middleware/TokenMiddleware";
import { AdminRoleMiddleware } from "../../../middleware/UserRoleMiddleware";

export class ProjectRouter {
    private router : Router;
    private projectController : ProjectController;

    constructor() {
        this.router = Router();
        this.projectController = new ProjectController(new ProjectRepository());
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/create', TokenMiddleware.validateToken ,this.projectController.create.bind(this.projectController));
        this.router.post('/onboard', TokenMiddleware.validateToken ,this.projectController.onboardProject.bind(this.projectController));
        this.router.get('/all', TokenMiddleware.validateToken ,this.projectController.getAll.bind(this.projectController));
        this.router.get('/search', TokenMiddleware.validateToken ,this.projectController.search.bind(this.projectController));
        this.router.delete('/delete', TokenMiddleware.validateToken, AdminRoleMiddleware ,this.projectController.delete.bind(this.projectController));

        this.router.post('/add-member', TokenMiddleware.validateToken, AdminRoleMiddleware ,this.projectController.addMember.bind(this.projectController));
        this.router.post('/remove-member', TokenMiddleware.validateToken, AdminRoleMiddleware ,this.projectController.removeMember.bind(this.projectController));
        this.router.post('/change-member-role', TokenMiddleware.validateToken, AdminRoleMiddleware ,this.projectController.changeMemberRole.bind(this.projectController));
    }

    getRouter(): Router {
        return this.router;
    }
}