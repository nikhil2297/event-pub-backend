import { CreateProjectDTO } from "../../domain/dtos/CreatePorjectDTO";
import { IProject } from "../../domain/entities/IProject";

export interface IProjectRepository {
    create(data: CreateProjectDTO): Promise<IProject>;
    findByName(name: string, userIdentifier: string): Promise<IProject[]>;
    findByUserId(userId: string): Promise<IProject[]>; // This method will return all projects from a user who are the owner of the project or a member
    addMember(projectId: string, userId: string, scope : string): Promise<void>;
    removeMember(projectId: string, userId: string): Promise<void>;
    changeMemberRole(projectId: string, userId: string, role: string): Promise<void>;
    delete(projectId: string): Promise<void>;
}