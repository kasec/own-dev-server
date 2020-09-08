import { createFilter } from 'rollup-pluginutils'
export default function pugToHtml (options) {
    const {exclude, include, pattern} = options
    const filter = createFilter(include || ['**/*.pug'], exclude || '');
    return {
      name: 'injecting-libraries',
      resolveId(source) {
        console.log('resolve', source);

        return 'resolve'
        
      },
      load(id) {
        console.log('load ->', id);
        return "export default 'hh about'"
        // return Promise.resolve({ code: 'import from ./blog.html' })
      },
      // transform(code, id) {
      //   // console.log('transform', code);
      //   // if(pattern.test(id) && code) {
      //   //     // console.log(code);
            
      //   // }
      //   return 'export default ' + code
      // },
      generateBundle: function generateBundle(opts, bundle) {
        console.log('bundle', bundle);
        
      }
    }
}