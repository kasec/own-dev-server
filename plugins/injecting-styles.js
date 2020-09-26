import { createFilter } from 'rollup-pluginutils'
export default function injectingCSS (options) {
  // this plugin works to get css styles in styles dir or dir where user select.
    const {exclude, include, pattern} = options
    const filter = createFilter(include || ['**/*.css'], exclude || '');
    return {
      name: 'injecting-css',
      // resolveId(source) {
      //   return source
        
      // },
      // load(id) {
      //   console.log('load ->', id);
      //   return "export default 'hh about'"
      //   // return Promise.resolve({ code: 'import from ./blog.html' })
      // },
      transform(code, id) {
        // console.log('transform', code);
        if(filter(id) && pattern.test(id)) {
          // console.log(id);

          const fileName = id.replace(/(.*src\/)/, '')
          // console.log('source', source);
          
          const chunkFile = {
              type: 'asset',
              source: code,
              name: fileName,
              fileName
          };
          // return { code: source, map: { mappings: "" }}
          const file = this.emitFile(chunkFile);
          // console.log(this.getFileName(file));
          
          return ''
        }
        // if(pattern.test(id) && code) {
        //     // console.log(code);
            
        // }
      },
      // generateBundle: function generateBundle(opts, bundle) {
      //   console.log('bundle', bundle);
        
      // }
    }
}