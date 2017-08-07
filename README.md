# Gulp-Auto-Rollup

> Automatic ES6 Module Bundler

Intended as an ES6 module support drop-in, if your ES6 modules work nativeley in the browser, this plugin should be able to bundle them automatically. So you can develop with native modules, and bundle without explicit configuration.

Gulp-Auto-Rollup can take a mixed stream of js modules and non-modules. Automatically determine multiple entry points, provide per entry options, bundle them with rollup, and passthrough any non-modules untouched.

## Install

```sh
npm install --save gulp-auto-rollup
```

## Usage

Basic usage with [Gulp](//github.com/gulpjs/gulp):

```js
const gulp = require('gulp');
const autoRollup = require('gulp-auto-rollup');

gulp.task('Bundle', () => gulp.src('src/**/*.js')
	.pipe(autoRollup(path => ({
		format: 'iife'
	})))
	.pipe(gulp.dest('dist'));
);
```

Basic usage with [Gurt](//github.com/learningscience/gurt):

```js
const autoRollup = require('gulp-auto-rollup');

module.exports['Bundle'] = (stream, filter) => stream
	.pipe(filter('**/*.js'))
	.pipe(autoRollup(path => ({
		format: 'iife'
	})));
```

Example Input:
```
A.js
    \
    B.js
        \
D.js    C.js
    \
    E.js
    /   \
G.js    F.js
    \
    H.js
        \
J.js    I.js
```

Example Output:
```
A.js => Bundle of A, B, C
D.js => Bundle of D, E, F
G.js => Bundle of G, E, F, H, I
J.js => Untouched
```

## API

### autoRollup([options])

Type: `Function`

Called for each entry, receives the entry path and returns an options object, a combination of the `rollup` and `generate` options. See the [rollup API](//github.com/rollup/rollup/wiki/JavaScript-API) for details.

## Contribute

Suggestions and contributions will be considered. When crafting a pull request please consider if your contribution is a good fit with the project, follow contribution best practices and use the github "flow" workflow.

## License

[The MIT License](LICENSE.md)
