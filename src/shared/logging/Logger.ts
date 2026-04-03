export class Logger {
    static info(message: string, context?: any) {
        console.log(
            JSON.stringify({
                level: 'info',
                message,
                context,
                timestamp: new Date().toISOString(),
            })
        );
    }

    static error(message: string, error: any, context?: any) {
        console.error(
            JSON.stringify({
                level: 'error',
                message,
                error: error?.message,
                stack: error?.stack,
                context,
                timestamp: new Date().toISOString(),
            })
        );
    }
}