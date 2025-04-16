export declare enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG"
}
export declare class Logger {
    id: string;
    level: LogLevel;
    message?: string;
    duration?: string;
    context: Record<string, any>;
    meta?: Record<string, any>;
    timestamp: Date;
}
