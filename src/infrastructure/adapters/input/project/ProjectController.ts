import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../../../../shared/utils/ResponseFormatter";
import { CreateProjectUseCase } from "../../../../application/usecases/project/CreateProjectUseCase";
import { AllProjectUseCase } from "../../../../application/usecases/project/AllProjectUseCase";
import { SearchProjectUseCase } from "../../../../application/usecases/project/SearchProjectUseCase";
import { AddMemberUseCase } from "../../../../application/usecases/project/AddMemberUseCase";
import { ChangeMemberRoleUseCase } from "../../../../application/usecases/project/ChangeMemberRoleUseCase";
import { DeleteMemberUseCase } from "../../../../application/usecases/project/DeleteMemberUseCase";
import { DeleteProjectUseCase } from "../../../../application/usecases/project/DeleteProjectUseCase";
import { IProjectRepository } from "../../../../application/ports/repository/IProjectRepository";

export class ProjectController {
    constructor(private readonly projectRepository: IProjectRepository) {
    }


    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new CreateProjectUseCase(this.projectRepository);
            const project = usecase.execute(req.body);

            res.json(ResponseFormatter.success(project, 'Project created successfully'));
        }catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new AllProjectUseCase(this.projectRepository);
            const projects = usecase.execute(req.body.user.userId);

            res.json(ResponseFormatter.success(projects, 'Projects fetched successfully'));
        }catch (error) {
            next(error);
        }
    }

    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new SearchProjectUseCase(this.projectRepository);
            const searchText = req.query.search as string;
            const projects = usecase.execute( searchText ,req.body.user.userId);

            res.json(ResponseFormatter.success(projects, 'Projects fetched successfully'));
        }catch (error) {
            next(error);
        }
    }

        async delete(req: Request, res: Response, next: NextFunction) {
            try {
                const usecase = new DeleteProjectUseCase(this.projectRepository);
                await usecase.execute(req.body.projectId);

                res.json(ResponseFormatter.success({}, 'Project deleted successfully'));
            }catch (error) {
                next(error);
            }
        }

    async addMember(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new AddMemberUseCase(this.projectRepository);
            const { projectId, userId, scope } = req.body;
            await usecase.execute(projectId, userId, scope, req.body.user.userId);

            res.json(ResponseFormatter.success({}, 'Member added successfully'));
        }catch (error) {
            next(error);
        }
    }

    async changeMemberRole(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new ChangeMemberRoleUseCase(this.projectRepository);
            const { projectId, userId, scope } = req.body;
            await usecase.execute(projectId, userId, scope, req.body.user.userId);

            res.json(ResponseFormatter.success({}, 'Member role changed successfully'));
        }catch (error) {
            next(error);
        }
    }

    async removeMember(req: Request, res: Response, next: NextFunction) {
        try {
            const usecase = new DeleteMemberUseCase(this.projectRepository);
            const { projectId, userId } = req.body;
            await usecase.execute(projectId, userId, req.body.user.userId);

            res.json(ResponseFormatter.success({}, 'Member removed successfully'));
        }catch (error) {
            next(error);
        }
    }
}