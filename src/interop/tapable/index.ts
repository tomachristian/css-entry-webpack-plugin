import Tapable,
       { AsyncWaterfallCallback, AsyncWaterfallHandler,
         AsyncCallback, AsyncHandler } from "tapable";

export * from "tapable";
export default Tapable;

/**
 * Transforms a promise returning function to an AsyncWaterfallHandler function.
 * @param handler The function that returns the promise.
 * @returns The AsyncWaterfallHandler function.
 */
export function toAsyncWaterfallHandler<T>(
    handler: (value: T) => Promise<T> | T): AsyncWaterfallHandler<T> {
    return (value, callback) => Promise.resolve()
        .then(() => handler(value))
        .then(newValue => callback(null, newValue),
              err => callback(err, value));
}

/**
 * Transforms a promise returning function to an AsyncHandler function.
 * @param handler The function that returns the promise.
 * @returns The AsyncHandler function.
 */
export function toAsyncHandler(
    handler: () => Promise<void>): AsyncHandler {
    return callback => Promise.resolve()
        .then(() => handler())
        .then(() => callback(),
              err => callback(err));
}
