export default class CssEntryPluginError extends Error {
    constructor(message: string) {
        super("CssEntryPlugin: " + message);

        if (Error.hasOwnProperty("captureStackTrace")) {
            Error.captureStackTrace(this, this.constructor);
        }

        this.name = "CssEntryPluginError";
    }
}
