import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy'
import multi from '@rollup/plugin-multi-entry';
import injectingStyles from '../plugins/injecting-styles'
import livereload from 'rollup-plugin-livereload'
import devServer from '../plugins/rollup-plugin-serve'

export default {
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