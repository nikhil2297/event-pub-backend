// src/index.ts
import { Application } from './main';
import { Logger } from './shared/utils/Logger';

interface ErrorWithMessage {
    message: string;
    stack?: string;
    code?: string | number;
}

function getErrorMessage(error: unknown): ErrorWithMessage {
    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
            code: (error as any).code
        };
    }
    
    return {
        message: String(error)
    };
}

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    const error = getErrorMessage(reason);
    Logger.error('Unhandled Promise Rejection:', {
        error,
        // Convert promise to string to avoid circular reference
        promise: promise.toString()
    });
    // Throw so it becomes an uncaughtException
    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    Logger.error('Uncaught Exception:', getErrorMessage(error));
    // Exit with error
    process.exit(1);
});

class ApplicationBootstrap {
    private static instance: Application;

    static async start(): Promise<void> {
        try {
            Logger.info('Starting application...');
            
            // Initialize application
            this.instance = new Application();
            
            // Start the application
            await this.instance.start();
            
            Logger.info('Application started successfully');
            
        } catch (error: unknown) {
            Logger.error('Failed to start application:', getErrorMessage(error));
            process.exit(1);
        }
    }

    static getInstance(): Application {
        if (!this.instance) {
            throw new Error('Application not initialized');
        }
        return this.instance;
    }
}

// Start the application
ApplicationBootstrap.start().catch((error: unknown) => {
    Logger.error('Fatal error during application bootstrap:', getErrorMessage(error));
    process.exit(1);
});

// Export for testing purposes
export { ApplicationBootstrap };