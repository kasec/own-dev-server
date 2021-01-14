import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy'
import multi from '@rollup/plugin-multi-entry';
import injectingStyles from '../plugins/injecting-styles'
import pug from 'rollup-plugin-pug';
import viewHandler from '../plugins/view-handler-plugin'
import md from 'rollup-plugin-md';

export default {
	input: ['src/**/*.pug', 'src/**/*.css', 'src/**/*.js'],
	output: { dir: '_dist' },
	plugins: [
		clear({
			targets: ['_dist'],
		}),
		copy({
			targets: [ { src: 'src/assets', dest: '_dist' } ]
		}),
		multi({entryFileName: 'bundle.js'}),
		pug({
			doctype: 'html',
			compileDebug: true,            // `true` is recommended for development
			sourceMap: true,                // with or without compileDebug option
			inlineRuntimeFunctions: false,  // use the pug runtime
			extensions: ['.pug', '.jade'],
			staticPattern: /(?:pug|jade)$/,
			basedir: 'src'
		}),
		injectingStyles({ pattern: /styles\/.+\.(?:css)$/}),
		viewHandler({
			pattern: /\.static\.(?:pug)$/,
		})
	]
}