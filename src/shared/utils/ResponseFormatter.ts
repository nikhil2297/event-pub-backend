export class ResponseFormatter {
    static success<T>(data: T, message: string = 'Success') {
        return {
            success: true,
            message,
            data
        };
    }

    static error(message: string, code: string = 'ERROR', errors?: any) {
        return {
            success: false,
            message,
            code,
            errors
        };
    }
}