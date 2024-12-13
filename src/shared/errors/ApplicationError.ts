import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class NotFoundError extends BaseError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(message, 401, 'UNAUTHORIZED_ERROR');
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConnectionError extends BaseError {
    constructor(message: string) {
        super(message, 500, 'CONNECTION_ERROR');
    }
}

export class DatabaseError extends BaseError {
    constructor(message: string) {
        super(message, 500, 'DATABASE_ERROR');
    }
}