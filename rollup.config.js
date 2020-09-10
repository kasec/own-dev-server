import pug from 'rollup-plugin-pug';
import serve from 'rollup-plugin-serve'
import css from 'rollup-plugin-css-only'
import selectingViews from './plugins/selecting-views-plugin'
import copy from 'rollup-plugin-copy'
import injectingStyles from './plugins/injecting-styles'
import multi from '@rollup/plugin-multi-entry';
import livereload from 'rollup-plugin-livereload'
import clear from 'rollup-plugin-clear'
export default {
	input: ['src/**/*.pug', 'src/**/*.css', 'src/**/*.js'],
	// input: ['src/index.js'],
	
	output: { dir: 'output' },
	plugins: [
		livereload('output'),
		serve('output'),
		clear({
			targets: ['output'],
		}),
		copy({
			targets: [
				{ src: 'src/assets', dest: 'output' },
			]
		}),
		multi({entryFileName: 'bundle.js'}),
		// assetsLoader(),
		// css({output: 'output/styles/bundle.css', include: ['src/styles/*.css'], exclude: ['src/**/*.css']}),
	// 	// // stylus(),
		pug({
			doctype: 'html',
			compileDebug: true,            // `true` is recommended for development
			sourceMap: true,                // with or without compileDebug option
			inlineRuntimeFunctions: false,  // use the pug runtime
			extensions: ['.pug', '.jade'],
			staticPattern: /(?:pug|jade)$/
		}),
		injectingStyles({ pattern: /styles\/.+\.(?:css)$/}),
		selectingViews({
			pattern: /\.static\.(?:pug)$/,
			stylesDir: '/styles', //obviusly inside of output. its function its ref in each html to /output/[stylesDir]/main.css
		}),
	]
};

// Simple example live reload 
// import serve from 'rollup-plugin-serve'
// import livereload from 'rollup-plugin-livereload'

// export default {
// 	input: ['src/index.js'],
// 	output: {
// 		file: './output/bundle.js',
// 		format: 'es'
// 	},
// 	plugins: [
// 		livereload('output'),
// 		serve('output'),
// 	]
// };

// export default {
// 	input: 'esp',
// 	output: {
// 		file: './output/bundle.js',
// 		format: 'es'
// 	},
// 	plugins: [
// 		(() => ({
// 			name: 'some',
// 			resolveId: (spurce) => {
// 				return spurce
// 			},
// 			load ( id ) {
// 				console.log(id);
// 				if (id === 'esp') {
// 				  return 'export default "This is virtual!"'; // the source code for "virtual-module"
// 				}
// 				return null; // other ids should be handled as usually
// 			  }
// 		}))(),
// 		livereload('output'),
// 		serve('output'),
// 	]
// };