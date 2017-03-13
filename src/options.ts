import _ from "lodash";

import { EntryInfo } from "./models";
import CssEntryPluginError from "./CssEntryPluginError";

export function normalizeOptions(options: Options): NormalizedOptions {
    if (!options.extensions && !options.test) {
        options.extensions = [".css", ".scss", ".less", ".styl"];
    }

    let normalized: NormalizedOptions = {
        disable: !!options.disable,

        output: options.output,

        includeCssEntry: () => true,
        isValidCssEntryResource: () => true
    };

    if (options.extensions && options.test) {
        throw new CssEntryPluginError("Both 'extensions' and 'test' specified");
    }
    else if (options.extensions) {
        if (!_.isArray(options.extensions) &&
            !_.isString(options.extensions)) {
            throw new CssEntryPluginError(
                "Option 'extensions' should be an array of strings or a string");
        }

        let extensions = Array.isArray(options.extensions)
            ? [...options.extensions]
            : [options.extensions];

        normalized.isValidCssEntryResource = (resource: string, entry: any) => {
            for (let ext of extensions) {
                if (resource.endsWith(ext)) return true;
            }

            return false;
        };
    }
    else if (options.test) {
        if (!_.isFunction(options.test) &&
            !_.isRegExp(options.test)) {
            throw new CssEntryPluginError(
                "Option 'test' should be a function or a regular expression");
        }

        if (_.isRegExp(options.test)) {
            let regexp = options.test;
            options.test = (resource, entry) => regexp.test(resource);
        }

        normalized.isValidCssEntryResource = options.test;
    }

    if (options.entries && options.ignoreEntries) {
        throw new CssEntryPluginError("Both 'entries' and 'excludeEntries' specified");
    }
    else if (options.entries) {
        normalized.includeCssEntry = entryConditionToMatcher(options.entries);
    }
    else if (options.ignoreEntries) {
        normalized.includeCssEntry = entryConditionToMatcher(options.ignoreEntries, true);
    }

    return normalized;
}

export function entryConditionToMatcher(
    condition: EntryCondition, negate: boolean = false): (entry: EntryInfo) => boolean {
    let fn = (entry: EntryInfo) => true;

    if (typeof condition === "string") {
        fn = entry => entry.name === condition;
    }
    else if (Array.isArray(condition)) {
        fn = entry => condition.indexOf(entry.name) !== -1;
    }
    else if (condition instanceof RegExp) {
        fn = entry => condition.test(entry.name);
    }
    else if (_.isFunction(condition)) {
        fn = condition;
    }

    return negate
        ? _ => !fn(_)
        : fn;
}

export type EntryCondition = RegExp | string | string[] | ((entry: EntryInfo) => boolean);
export type EntryResourceCondition = RegExp | ((resource: string, entry: EntryInfo) => boolean);

export interface CssEntryPluginOutputOptions {
    path?: string;
    filename: string;
    publicPath?: string;
}

export interface Options {
    disable?: boolean;

    /**
     * Output options.
     */
    output: CssEntryPluginOutputOptions;

    /**
     * The condition for the entries to include.
     */
    entries?: EntryCondition;

    /**
     * The condition for the entries to ignore.
     */
    ignoreEntries?: EntryCondition;

    /**
     * Which file extensions will be valid in a css entry.
     */
    extensions?: string | string[];

    /**
     * A condition to match valid files for css entries.
     */
    test?: EntryResourceCondition;
}

export interface NormalizedOptions {
    disable: boolean;

    output: CssEntryPluginOutputOptions;

    includeCssEntry: (entry: EntryInfo) => boolean;
    isValidCssEntryResource: (resource: string, entry: EntryInfo) => boolean;
}
