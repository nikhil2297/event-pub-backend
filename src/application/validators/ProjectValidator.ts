import { CreateProjectDTO } from "../../domain/dtos/CreatePorjectDTO";
import { ValidationError } from "../../shared/errors/ApplicationError";

export class ProjectValidator {

    static validateCreateProject(data: CreateProjectDTO) : void {
        if (!data.name) {
            throw new ValidationError('Name is required');
        }

        if(!data.owner) {
            throw new ValidationError('Owner is required');
        }
    }

    static validateSetMemberRole(owner: string, member: string, scope: string) : void {
        if(owner === member) {
            throw new ValidationError('Owner role cannot be changed');
        }

        if(scope == 'ADMIN') {
            throw new ValidationError('Members cannot have admin role');
        }
    }

    static projectNameValidator(name: string) : void {
        if(name.length < 3) {
            throw new ValidationError('Project name must have at least 3 characters');
    }
}
}