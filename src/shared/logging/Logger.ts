type LogContext = Record<string, unknown> | undefined;

function buildEntry(level: string, message: string, extra?: object): string {
    return JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...extra });
}

function serializeUnknownError(error: unknown): string {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown error";
    }
}

export class Logger {
    static info(message: string, context?: LogContext): void {
        console.log(buildEntry("info", message, { context }));
    }

    static warn(message: string, context?: LogContext): void {
        console.warn(buildEntry("warn", message, { context }));
    }

    static error(message: string, error: unknown, context?: LogContext): void {
        const err = error instanceof Error ? error : undefined;
        console.error(
            buildEntry("error", message, {
                error: {
                    name: err?.name,
                    message: err?.message ?? serializeUnknownError(error),
                    stack: err?.stack,
                },
                context,
            })
        );
    }
}