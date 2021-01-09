import path from 'path'
import { createFilter } from 'rollup-pluginutils'

const createChunk = (callback) => function(fileId) {
  const file = {
    type: 'chunk',
    id: fileId,
  };
  // return { code: source, map: { mappings: "" }}
  return callback(file);   
}

const createFile = function(fileId, source, callback) {
  const newName = fileId.replace(path.basename(fileId), Math.floor(Date.now() / 1000 ) + '-' + path.basename(fileId)) 
  return callback({
    type: 'asset',
    source,
    fileName: cleanId(newName)
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

const cssFilter = createFilter(['**/*.css']);
const jsFilter = createFilter(['**/*.js']);
const pugFilter = createFilter(['**/*.pug']);
const mdFilter = createFilter(['**/*.md']);

export default function viewHandler (options) {
    const { pattern = /\.view\.(?:pug)$/, isDev } = options;
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
          
          const scripts = files.filter(jsFilter)
          const styles = files.filter(cssFilter)

          views[id]  = { 
            ...views[id], 
            id,
            styles,
            scripts: scripts.map(createChunk(this.emitFile))
          }
        }
      },
      transform(code, id) {
        console.log('tranform', id);
        if(mdFilter(id)) {
          const fileName = id.replace(/(.*src\/)/, '').replace(/(views\/)/, '')
          // console.log('fileName', fileName);
          this.emitFile({
            name: fileName,
            fileName: fileName,
            type: 'asset',
            source: code
          })
          return ''
        } 
        if(isDev) {
          if(pugFilter(id)) {
            const fileName = id.replace(/(.*src\/)/, '').replace(/(views\/)/, '')
            // console.log('fileName', fileName);
            this.emitFile({
              name: fileName,
              fileName: fileName,
              type: 'asset',
              source: code
            })
            return ''
          } 
        }
        else {
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
        }

        // if(jsFilter(id)) {
        //   Object.values(views).forEach((view) => {
        //     const scriptExists = view.files && view.files.indexOf(id) !== -1
        //     views[view.id] = scriptExists ? 
        //       {
        //         ...view,
        //         scripts: [...(view.scripts || []) , createChunk(id, this.emitFile)]
        //       } : {...view, scripts: [...(view.scripts || [])] }
        //   })
        // }
        if(cssFilter(id)) {
          Object.values(views).forEach((view) => {
            views[view.id] = {
                ...view,
                styles: view.styles.map(_id => _id === id ? createFile(id, fixImport(code), this.emitFile) : _id)
              }
          })
          return ''
        }
        return null
      },
      generateBundle(options, bundle) {
        // console.log('generateBundle view-handler-plugin', bundle);
        if(isDev) {
          return Object.values(views)
            .map(mappingStyles(bundle))
            .reduce(resolveFileNames(this.getFileName), {})
        } else
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
const mappingStyles = bundle => function(view) {
  console.log('view.styles', view.styles)
  const styles = view.styles.map(style => /[0-9]{10}-.+\.css/.test(style) ? style : getBundleStyle(bundle, style))
  console.log({ styles });
  return ({ 
    ...view,
    styles
  })
}
const getBundleStyle = function(bundle, id) {

  const bundleFiles = Object.values(bundle).map(item => item.fileName)
  const dirname = path.dirname(id).replace(/(.+views(?:\/*))/, '')
  const name = path.basename(id);
  console.log('id', id);
  console.log({ dirname, name });
  
  const fileId = bundleFiles.find(file => {
    return file.indexOf(dirname) !== -1 && file.indexOf(name) !== -1
  } )
  
  return cssFilter(id) ? fileId : id
}
const resolveFileNames = (getFileName) => function(views, view) {
  // view : { id: view path, files: files-in-the-same-folder, styles: css-files, scripts: js-files }
  const styles = (view.styles || []).map(style => style.indexOf('.css') !== -1 ? style : getFileName(style)) 
  const scripts = (view.scripts || []).map(script => getFileName(script)) 

  console.log({ styles, scripts });
  return {...views, [view.id]: { styles, scripts, id: view.id } }
}