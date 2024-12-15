import { IProjectRepository } from "../../../../application/ports/IProjectRepository";
import { CreateProjectDTO } from "../../../../domain/dtos/CreatePorjectDTO";
import { IProject } from "../../../../domain/entities/IProject";
import { DatabaseError, ValidationError } from "../../../../shared/errors/ApplicationError";
import { Logger } from "../../../../shared/utils/Logger";
import { ProjectModel } from "../schemas/ProjectSchema";

export class ProjectRepository implements IProjectRepository {
    async create(data: CreateProjectDTO): Promise<IProject> {
        try {
            data.members = [{
                identifier: data.owner,
                scope: 'ADMIN',
                pending: false
            }]

            Logger.info('Creating project:', data);
            const project = new ProjectModel(data);

            const savedProject = await project.save();
            return savedProject;
        }catch (error) {
            Logger.error("Error creating project", error);
            throw new DatabaseError('Error creating project');
        }
    }

    async findByName(name: string, userIdentifier: string): Promise<IProject[]> {
        try {
            const searchRegex = new RegExp(name, 'i');
            
            const project = await ProjectModel.find({
                name: searchRegex,
                $or: [
                    { owner: userIdentifier },
                    { 'members.identifier': userIdentifier }
                ]
            });

            return project;
        }catch (error) {
            Logger.error("Error finding project", error);
            throw new DatabaseError('Error finding project');
        }
    }
    
    async findByUserId(userId: string): Promise<IProject[]> {
        try {
            const projects = await ProjectModel.find({
                $or: [
                    { owner: userId },
                    { 'members.identifier': userId }
                ]
            });


            return projects;
        }catch (error) {
            Logger.error("Error finding projects", error);
            throw new DatabaseError('Error finding projects');
        }
    }
    async addMember(projectId: string, userId: string, scope: string): Promise<void> {
        try {
            const project = await ProjectModel.findById(projectId);

            if(!project) {
                Logger.error('Project not found:', projectId);
                throw new ValidationError(`Project with id ${projectId} not found`);
            }

            const member = {
                identifier: userId,
                pending: true,
                scope: scope
            };

            project.members.push(member);
            await project.save();
            
        }catch (error) {
            Logger.error("Error adding member to project", error);
            throw new DatabaseError('Error adding member to project');
        }
    }
    async removeMember(projectId: string, userId: string): Promise<void> {
        try {
            const project = await ProjectModel.findById(projectId);

            if(!project) {
                Logger.error('Project not found:', projectId);
                throw new ValidationError(`Project with id ${projectId} not found`);
            }

            project.members = project.members.filter(member => member.identifier !== userId);
            await project.save();
        }catch (error) {
            Logger.error("Error removing member from project", error);
            throw new DatabaseError('Error removing member from project');
        }
    }
    async changeMemberRole(projectId: string, userId: string, role: string): Promise<void> {
        try {
            const project = await ProjectModel.findById(projectId);

            if(!project) {
                Logger.error('Project not found:', projectId);
                throw new ValidationError(`Project with id ${projectId} not found`);
            }

            const member = project.members.find(member => member.identifier === userId);

            if(!member) {
                Logger.error('Member not found:', userId);
                throw new ValidationError(`Member with id ${userId} not found in project`);
            }

            member.scope = role;
            await project.save();

        } catch (error) {
            Logger.error("Error changing member role", error);
            throw new DatabaseError('Error changing member role');
        }
    }
    async delete(projectId: string): Promise<void> {
        try {
            const project = await ProjectModel.findById(projectId);

            if(!project) {
                Logger.error('Project not found:', projectId);
                throw new ValidationError(`Project with id ${projectId} not found`);
            }

            await project.deleteOne({
                _id: projectId
            });
        }catch (error) {
            Logger.error("Error deleting project", error);
            throw new DatabaseError('Error deleting project');
        }
    }

}