import pug from 'rollup-plugin-pug';
import viewHandler from './plugins/view-handler-plugin'
import copy from 'rollup-plugin-copy'
import injectingStyles from './plugins/injecting-styles'
import serve from 'rollup-plugin-serve'
import multi from '@rollup/plugin-multi-entry';
import livereload from 'rollup-plugin-livereload'
import clear from 'rollup-plugin-clear'
import devServer from './plugins/rollup-plugin-serve'
import md from 'rollup-plugin-md';


const { DEVELOPMENT } = process.env

let rollupConfiguration;
console.log({ DEVELOPMENT });
if(DEVELOPMENT) {
	rollupConfiguration = {
		input: ['src/**/*.pug', 'src/**/*.css', 'src/**/*.js', 'src/**/*.md'],
		output: { dir: '_dist' },
		plugins: [
			clear({
				targets: ['_dist'],
			}),
			copy({
				targets: [ { src: 'src/assets', dest: '_dist' } ]
			}),
			multi({entryFileName: 'bundle.js'}),
			injectingStyles({ pattern: /styles\/.+\.(?:css)$/}),
			livereload('_dist'),
			devServer('_dist'),
		]
	}
} else rollupConfiguration = {
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
		livereload('_dist'),
		serve('_dist'),
		viewHandler({
			pattern: /\.static\.(?:pug)$/,
		})
	]
}

export default rollupConfiguration;