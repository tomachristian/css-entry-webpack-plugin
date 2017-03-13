export default class Resolver {
    resolve(context: ResolveContext, path: string, request: string, callback: LoggingCallbackWrapper): any;
}

export interface LoggingCallbackTools {
    log?(msg: string): void;
    stack?: string[] | undefined;
    missing?: string[] | {
        push: (item: string) => void;
    };
}

export interface LoggingCallbackWrapper extends LoggingCallbackTools {
    (err?: Error | null, ...args: any[]): any;
}

export interface ResolveContext {
    issuer?: string;
}
