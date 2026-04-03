export class AppError extends Error {
    public readonly statusCode: number;
    public readonly context?: unknown;

    constructor(message: string, statusCode = 400, context?: unknown) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.context = context;
    }

    static badRequest(message: string, context?: unknown): AppError {
        return new AppError(message, 400, context);
    }

    static notFound(message: string): AppError {
        return new AppError(message, 404);
    }

    static internal(message = "Internal server error"): AppError {
        return new AppError(message, 500);
    }
}