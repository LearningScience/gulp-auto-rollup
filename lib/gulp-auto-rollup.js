'use strict';

const path = require('path'),
	rollup = require('rollup'),
	through2 = require('through2');

/**
 * Utils
 */

const resolve = (a, b) => path.resolve(path.dirname(a), b);

const imports = /(?:^|\n)(?:\s*import\s+)(?:[^'"]+['"]([^'"]+)['"])/g;

/**
 * Sort Modules
 */

const sort = ({obj, txt, ref}, opts, file, done) => {
	let a = file.path, r;
	obj[a] = file;
	txt[a] = file.contents.toString();
	while (r = imports.exec(txt[a])) {
		let b = resolve(a, r[1]);
		ref[a] |= 1; // root or inner
		ref[b] |= 2; // inner or leaf
	}
	done();
};

/**
 * Make Bundles
 */

const make = ({obj, txt, ref}, opts, self, done) => {
	let bundles = 0;
	for (let id in obj) {
		// non-module
		if (ref[id] === undefined) {
			self.push(obj[id]);
		}
		// root-module
		if (ref[id] === 1) {
			// generate option
			let options = {
				entry: id,
				format: 'iife',
				plugins: []
			};
			Object.assign(
				options,
				opts(id)
			);
			// generate bundle
			rollup.rollup(options)
			.then(bundle => {
				!++ bundles && done();
				options.plugins.push({load: id => txt[id]});
				return bundle.generate(options);
			})
			.then(result => {
				self.push(obj[id]);
				obj[id].contents = new Buffer(result.code);
				!-- bundles && done();
			});
		}
	}
};

/**
 * Plugs
 */

module.exports = (opts = () => null) => {
	let state = {
		obj: {},
		txt: {},
		ref: {}
	};
	return through2.obj(
		function (file, en, done) {
			sort(state, opts, file, done);
		},
		function (done) {
			make(state, opts, this, done);
		}
	);
};
