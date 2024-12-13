// src/shared/utils/Logger.ts
interface LogMetadata {
    [key: string]: any;
}

export class Logger {
    private static formatDate(): string {
        return new Date().toISOString();
    }

    private static formatError(error: unknown): LogMetadata {
        if (error instanceof Error) {
            return {
                message: error.message,
                stack: error.stack,
                ...(error as any).code && { code: (error as any).code }
            };
        }
        return { message: String(error) };
    }

    private static formatMeta(meta: LogMetadata = {}): string {
        if (Object.keys(meta).length === 0) return '';
        return JSON.stringify(meta, null, process.env.NODE_ENV !== 'production' ? 2 : 0);
    }

    static info(message: string, meta: LogMetadata = {}): void {
        console.log(
            `[INFO] [${this.formatDate()}] ${message}`,
            this.formatMeta(meta)
        );
    }

    static error(message: string, error?: unknown): void {
        const errorMeta = error ? this.formatError(error) : {};
        console.error(
            `[ERROR] [${this.formatDate()}] ${message}`,
            this.formatMeta(errorMeta)
        );
    }

    static warn(message: string, meta: LogMetadata = {}): void {
        console.warn(
            `[WARN] [${this.formatDate()}] ${message}`,
            this.formatMeta(meta)
        );
    }

    static debug(message: string, meta: LogMetadata = {}): void {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(
                `[DEBUG] [${this.formatDate()}] ${message}`,
                this.formatMeta(meta)
            );
        }
    }

    static success(message: string, meta: LogMetadata = {}): void {
        console.log(
            `[SUCCESS] [${this.formatDate()}] ${message}`,
            this.formatMeta(meta)
        );
    }

    static http(message: string, meta: LogMetadata = {}): void {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `[HTTP] [${this.formatDate()}] ${message}`,
                this.formatMeta(meta)
            );
        }
    }
}