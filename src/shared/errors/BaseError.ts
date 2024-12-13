export class BaseError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
        public readonly code?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
