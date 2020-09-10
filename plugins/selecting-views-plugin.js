import path from 'path'
import { createFilter } from 'rollup-pluginutils'
const createChunk = function(fileId, callback) {
  const file = {
    type: 'chunk',
    id: fileId,
  };
  // return { code: source, map: { mappings: "" }}
  return callback(file);   
}
const createFile = function(fileId, source, callback) {
  return callback({
    type: 'asset',
    source,
    fileName: fileId.replace(/(.*src\/)/, '')
  })  

}
const setScripts = function(scripts = [], getFileName) {
  return scripts.reduce((scripts, current) => `${scripts} <script src="/${getFileName(current)}" type="module"></script>`,'')
}

const setStyles = function(styles = [], getFileName) {
  const str = styles.reduce((styles, current) => `${styles} <link rel="stylesheet" href="/${getFileName(current)}"/>`,'')
  return str
}

export default function pugToHtml (options) {
    const { pattern = /\.view\.(?:pug)$/, stylesDir } = options;
    let _stylesDir = stylesDir || ''
    const cssFilter = createFilter(['**/*.css']);
    const jsFilter = createFilter(['**/*.js']);
    
    let views = {}
    
    return {
      name: 'selecting-views',  // this name will show up in warnings and errors
      resolveId(id) {
        if(pattern.test(id)) {
          views[id] = { ...views[id], id }
        }
      },
      load(id) {
        if(pattern.test(id)) {
          const dirname = path.dirname(id).replace(/(.*src\/*)/, '')
          
          const files = Array
            .from(this.getModuleIds() || [])
            .filter(moduleId => 
                dirname && path.dirname(moduleId)
                  .replace(/(.*src\/*)/, '')
                  .indexOf(dirname) !== -1)

          views[id]  = { ...views[id], id, files }
        }
      },
      transform(code, id) {
        if(pattern.test(id) && code) {
          const source = code
            .replace(/^(export default ")/, "") // quit export default text
            .replace(/"(;)$/gm, '') // quit last "; from last
            .replace(/\\"/gm,"\"") // replace \" once its found
            .replace(/\\n/gm, ' ') // replace \n once its found with space
            .replace(/\"[^"]+\.css\"/gm, _stylesDir + '/main.css') //replace .css route with absolute path in output folder
          
          const fileName = id.replace(/(.*src\/)/, '').replace(pattern, '.html')
          
          views[id] = { ...views[id], source, fileName }
        }
        const existIdinViews = Object
          .values(views)
          .reduce((idFoundIt, current) => idFoundIt 
            ? idFoundIt 
            : current.files.indexOf(id) !== -1 
              ? current.id 
              : undefined
          , undefined)
        
        if(jsFilter(id) && existIdinViews !== undefined) views[existIdinViews].scripts =  [...(views[existIdinViews].scripts || []), createFile(id, code, this.emitFile)]
        else if(cssFilter(id) && existIdinViews !== undefined) {
          views[existIdinViews].styles  = [...(views[existIdinViews].styles || []), createFile(id, code, this.emitFile)]
          return '' 
        }
      },
      generateBundle(options, bundle) {
        Object.values(views).forEach(view => {
          this.emitFile({
            name: view.fileName,
            fileName: view.fileName,
            type: 'asset',
            source: view.source
              .replace(/[<]\/body>/gm, setScripts(view.scripts, this.getFileName) + '</body>') 
              .replace(/[<]\/head>/gm, setStyles(view.styles, this.getFileName) + '</head>'),
          })
        });
        
      }
    }
}