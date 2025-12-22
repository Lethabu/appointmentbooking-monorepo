// packages/worker/src/logger.ts

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

class Logger {
    private serviceName: string;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    private log(level: LogLevel, message: string, data?: any) {
        console.log(JSON.stringify({
            level,
            service: this.serviceName,
            message,
            ...data,
            timestamp: new Date().toISOString(),
        }));
    }

    debug(message: string, data?: any) {
        this.log(LogLevel.DEBUG, message, data);
    }

    info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any) {
        this.log(LogLevel.ERROR, message, data);
    }
}

export const logger = new Logger('worker');
