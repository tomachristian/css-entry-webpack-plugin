export interface Entry {
    [name: string]: string | string[];
}

export type Loader = any;

export interface Configuration {
    context?: string;
    entry?: string | string[] | Entry;
}
