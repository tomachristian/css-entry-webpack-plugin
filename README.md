<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>CSS Entry Plugin</h1>
</div>

[![Build Status][plugin-travis-shield]][plugin-travis-url]
[![License][plugin-license-shield]][plugin-npm-url]

A [Webpack][webpack-url] plugin that simplifies creation of CSS-only bundles.

Installation
------------
[![NPM Version][plugin-npm-version-shield]][plugin-npm-url]
[![Dependency Status][plugin-npm-dependencies-shield]][plugin-npm-dependencies-url]

Install the plugin using [npm][npm-url]:
```shell
$ npm install css-entry-webpack-plugin --save-dev
```

[![npm](https://nodei.co/npm/css-entry-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)][plugin-npm-url]

Basic Usage
-----------
The plugin will identify the entries that contain only CSS resources and will generate CSS bundles for them.

webpack.config.js
```js
const CssEntryPlugin = require("css-entry-webpack-plugin");

module.exports = {
  entry: {
    "styles": ["src/style1.css", "src/style2.css"],
    "main": "src/index.js"
  },
  output: {
    path: "dist",
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      // This is required
      {
        test: /\.css$/,
        use: "css-loader"
      }
    ]
  },
  plugins: [
    new CssEntryPlugin({
      output: {
        filename: "[name].bundle.css"
      }
    })
  ]
};
```

will output two files

`main.bundle.js` and `styles.bundle.css`

API
---

```js
new CssEntryPlugin(options: String | Object)
```

#### `options`
Type: `String | Function | Object`<br>
Optional

Specifies the options for the `CssEntryPlugin`.

The shorthand version allows you to specify the `output.filename` directly as a `String` or a `Function`, this will be equivalent to passing an object with `output.filename`. See [`output.filename`](#outputfilename) for details on the possible values.

```js
new CssEntryPlugin(/* option: String | Function */)
// is equivalent to
new CssEntryPlugin({
  output: {
    filename: /* option */
  }
})
```

When specified as an `Object`, the following options are available:

##### `output`
Type: `Object`<br>
Optional

Specifies a set of options instructing the plugin on how and where to output your CSS bundles. It works in a similar fashion to [Webpack's `output` option](https://webpack.js.org/configuration/output/#output-filename).

```js
new CssEntryPlugin({
  output: { /* output options */ }
})
```

##### `output.filename`
Type: `String | Function`<br>
Default: `[name].css`<br>
Optional

This option determines the name of each CSS output bundle. The bundle is written to the directory specified by the [Webpack `output.path` option](https://webpack.js.org/configuration/output/#output-path). It works in a similar fashion to [Webpack's `output.filename` option](https://webpack.js.org/configuration/output/#output-filename) and [`ExtractTextPlugin`'s `filename` option](https://github.com/webpack-contrib/extract-text-webpack-plugin#options).

For a single [`entry`](https://webpack.js.org/configuration/entry-context#entry) point, this can be a static name.

```js
filename: "bundle.css"
```

However, when creating multiple bundles via more than one entry point, you should use a [template string](https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js) with one of the following substitutions to give each bundle a unique name.

Using the entry name:

```js
filename: "[name].bundle.css"
```

Using the internal chunk id:

```js
filename: "[id].bundle.css"
```

The following substitutions are available in template strings:

|Substitution|Description|
|:----------:|:----------|
|`[name]`|The module name or name of the chunk|
|`[id]`|The number of the chunk or module identifier|
|`[contenthash]`|The hash of the content of the extracted file|

Any combination of these substitutions is allowed (eg. `"[name].[id].css"`).

The option can also be specified as a `Function` which should return the `filename` as a string without substitutions.

```js
filename: function (getPath /* (template: string) => string */) {
  return "prefix-" + getPath("[name].[id].css");
}
```

The `Function` has the signature `(getPath: ((template: string) => string)) => string` where `getPath` is a function passed as the first argument, that can be used to perform the substitutions on a given template string to retrieve the original path.

Note this option is called `filename` but you are still allowed to use or return something like `"css/[name]/bundle.css"` to create a folder structure.

Note this option only affects CSS output files for entries matched by this plugin (CSS entries).

##### `entries`
Type: `String | String[] | RegExp | Function`<br>
Optional and mutually exclusive with [`ignoreEntries`](#ignoreentries)

Specifies the entry or entries to consider as possible CSS entries. Other entries will be ignored.

##### `ignoreEntries`
Type: `String | String[] | RegExp | Function`<br>
Optional and mutually exclusive with [`entries`](#entries)

Specifies the entry or entries to ignore. Other entries will be considered as possible CSS entries.

##### `extensions`
Type: `String | String[]`<br>
Default: `[".css", ".scss", ".less", ".styl"]`<br>
Optional and mutually exclusive with [`test`](#test)

Specifies which file extensions are valid for files/resources inside considered CSS entries.

##### `test`
Type: `RegExp | Function`<br>
Optional and mutually exclusive with [`extensions`](#extensions)

Specifies which files/resources are valid for considered CSS entries.

##### `disable`
Type: `Boolean`<br>
Default: `false`<br>
Optional

Disables the plugin.

[webpack-url]: https://webpack.js.org/
[npm-url]: https://www.npmjs.com/

[plugin-npm-url]: https://npmjs.com/package/css-entry-webpack-plugin
[plugin-npm-dependencies-url]: https://david-dm.org/tomachristian/css-entry-webpack-plugin
[plugin-travis-url]: https://travis-ci.org/tomachristian/css-entry-webpack-plugin

[plugin-license-shield]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[plugin-npm-version-shield]: https://img.shields.io/npm/v/css-entry-webpack-plugin.svg?style=flat-square
[plugin-npm-dependencies-shield]: https://david-dm.org/tomachristian/css-entry-webpack-plugin.svg?style=flat-square
[plugin-travis-shield]: https://img.shields.io/travis/tomachristian/css-entry-webpack-plugin/develop.svg?style=flat-square
