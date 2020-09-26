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
  console.log('source => ', source);
  return callback({
    type: 'asset',
    source,
    fileName: cleanId(fileId)
  })  

}

const setScripts = function(scripts = [], getFileName) {
  return scripts.reduce((scripts, current) => `${scripts} <script src="/${getFileName(current)}" type="module"></script>`,'')
}

const setStyles = function(styles = [], getFileName) {
  const str = styles.reduce((styles, current) => `${styles} <link rel="stylesheet" href="/${getFileName(current)}"/>`,'')
  return str
}

const cleanId = function(str) {
  return str.replace(/(.*src\/views\/)/, '')
}

const fixImport = function(code) {
  return code.replace(/@import url\(\'\/src\/styles/gm, '@import url(\'/styles')
}

export default function viewHandler (options) {
    const { pattern = /\.view\.(?:pug)$/, stylesDir } = options;
    const cssFilter = createFilter(['**/*.css']);
    const jsFilter = createFilter(['**/*.js']);
    const pugFilter = createFilter(['**/*.pug']);
    let views = {}
    return {
      name: 'view-handler',  // this name will show up in warnings and errors
      load(id) {
        console.log('load', id);
        
        if(pattern.test(id)) {
          const dirname = path.dirname(id).replace(/(.*src\/*)/, '')
          //  console.log('getModuleIds', this.getModuleIds());
          const files = Array
          .from(this.getModuleIds() || [])
          .filter(moduleId => 
            path.dirname(moduleId)
            .replace(/(.*src\/*)/, '') === dirname)
            
          views[id]  = { ...views[id], id, files }
        }
      },
      transform(code, id) {
        console.log('tranform', id);
        
        if(pattern.test(id) && code) {
          const source = code
            .replace(/^(export default ")/, "") // quit export default text
            .replace(/"(;)$/gm, '') // quit last "; from last
            .replace(/\\"/gm,"\"") // replace \" once its found
            .replace(/\\n/gm, ' ') // replace \n once its found with space
            // .replace(/\"[^"]+\.css\"/gm, _stylesDir + '/main.css') //replace .css route with absolute path in output folder
          
          const fileName = cleanId(id).replace(pattern, '.html')
          
          views[id] = { ...views[id], source, fileName }
        }
        else if(jsFilter(id)) {
          Object.values(views).forEach((view) => {
            const scriptExists = view.files && view.files.indexOf(id) !== -1
            views[view.id] = scriptExists ? 
              {
                ...view,
                scripts: [...(view.scripts || []) , createChunk(id, this.emitFile)]
              } : {...view, scripts: [...(view.scripts || [])] }
          })
        }
        else if(cssFilter(id)) {
          Object.values(views).forEach((view) => {
            const styleExist = view.files && view.files.indexOf(id) !== -1
            views[view.id] = styleExist ? 
              {
                ...view,
                styles: [...(view.styles || []) , createFile(id, fixImport(code), this.emitFile)]
              } : {...view, styles: [...(view.styles || [])] }
          })
          return ''
        }
        return null
      },
      generateBundle(options, bundle) {
        Object.values(views).forEach(view => {
          view.source && this.emitFile({
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