export default class Tapable {
    _plugins: {
        [propName: string]: Handler[]
    };

    /**
     * invoke all plugins with this attached.
     * This method is just to "apply" plugins' definition, so that the real event listeners can be registered into
     * registry. Mostly the `apply` method of a plugin is the main place to place extension logic.
     */
    //apply(...plugins: (((this: this) => any) | Plugin)[]): void;
}

/*export interface TapableHook<
    TName extends string,
    THandler extends Function> {
    //applyPlugins(name: TName): void;

    plugin(name: TName, handler: THandler): void;
}*/

export interface Handler {
    (...args: any[]): void;
}

export interface Plugin {
    apply(...args: any[]): void;
}

export type AsyncWaterfallHandler<T> = (value: T, callback: AsyncWaterfallCallback<T>) => void;
export type AsyncWaterfallCallback<T> = (err: Error | null | undefined, nextValue: T) => void;

export type AsyncHandler = (callback: AsyncCallback) => void;
export type AsyncCallback = (err?: Error) => void;
