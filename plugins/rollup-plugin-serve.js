import { readFile } from 'fs'
import { createServer } from 'http'
import { resolve } from 'path'
import mime from 'mime'
import { createFilter } from 'rollup-pluginutils'
import pug from 'pug'
import viewHandler from './view-handler-plugin'
import md from 'markdown-it'
import hljs from 'highlight.js'

const mdRender = md({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
})

let server
let viewsInstance;

const pattern = /\.static\.(?:pug)$/
const pugOptions = {
  doctype: 'html',
  compileDebug: true,           
  sourceMap: true,              
  inlineRuntimeFunctions: false,
  basedir: '_dist',
  filters: {
    'md': function (text, options) {
      return md({
        html: true,
        linkify: true,
        typographer: true,
        langPrefix: 'language-',
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre class="hljs" data-lang="${lang}"><code>` +
                     hljs.highlight(lang, str, true).value +
                     '</code></pre>';
            } catch (__) {}
          }
      
          return '<pre class="hljs"><code>' + md().utils.escapeHtml(str) + '</code></pre>';
        }
    }).render(text)
    }
  }
}
/**
 * Serve your rolled up bundle like webpack-dev-server
 * @param {ServeOptions|string|string[]} options
 */
const setScripts = function(scripts = []) {
  return scripts.reduce((scripts, current) => `${scripts} <script src="/${current}" type="module"></script>`,'')
}

const setStyles = function(styles = []) {
  const str = styles.reduce((styles, current) => `${styles} <link rel="stylesheet" href="/${current}"/>`,'')
  return str
}
const cleanId = function(str) {
  return str.replace(/(.*_dist\/)/, '').replace(/(views\/)/, '')
}

let views
function serve (options = { contentBase: '' }) {
  if (Array.isArray(options) || typeof options === 'string') {
    options = { contentBase: options }
  }
  options.contentBase = Array.isArray(options.contentBase) ? options.contentBase : [options.contentBase || '']
  options.port = options.port || 10001
  options.headers = options.headers || {}
  options.openPage = options.openPage || ''
  mime.default_type = 'text/plain'
  const development = options.isDev

  if (options.mimeTypes) {
    mime.define(options.mimeTypes, true)
  }

  const requestListener = (request, response) => {
    console.log('requestListener', request.url);
    const urlPath = decodeURI(request.url.split('?')[0])

    Object.keys(options.headers).forEach((key) => {
      response.setHeader(key, options.headers[key])
    })

    readFileFromContentBase(options.contentBase, urlPath, function (error, content, filePath) {
      if (!error) {
        return found(response, filePath, content)
      }
      if (error.code !== 'ENOENT') {
        response.writeHead(500)
        response.end('500 Internal Server Error' +
          '\n\n' + filePath +
          '\n\n' + Object.values(error).join('\n') +
          '\n\n(rollup-plugin-serve)', 'utf-8')
        return
      }
      if (options.historyApiFallback) {
        const fallbackPath = typeof options.historyApiFallback === 'string' ? options.historyApiFallback : '/index.html'
        readFileFromContentBase(options.contentBase, fallbackPath, function (error, content, filePath) {
          if (error) {
            notFound(response, filePath)
          } else {
            found(response, filePath, content)
          }
        })
      } else {
        notFound(response, filePath)
      }
    })
  }
  // release previous server instance if rollup is reloading configuration in watch mode
  console.log('server var => ', server);

  if (server) {
    server.close()
  } else {
    closeServerOnTermination()
  }
  
  server = createServer(requestListener).listen(options.port, options.host)
  
  const pugFilter = createFilter(['**/*.pug']);
  const cssFilter = createFilter(['**/*.css']);
  const jsFilter = createFilter(['**/*.js']);
  let running = options.verbose === false
  return {
    name: 'serve',
    buildStart() {
      viewsInstance = viewHandler({pattern, isDev: true})
    },
    load(id) {
      return viewsInstance.load.call(this, id)
    },
    transform(code, id) {
      return viewsInstance.transform.call(this, code, id)
    },
    generateBundle (opts, bundle) {
      views = viewsInstance.generateBundle.call(this, opts, bundle)
      console.log('generateBundle rollup plugin serve');
      if (!running) {
        running = true
        // Log which url to visit
        const url = 'http' + '://' + (options.host || 'localhost') + ':' + options.port
        options.contentBase.forEach(base => {
          console.log(green(url) + ' -> ' + resolve(base))
        })
      }
    }
  }
}

function readFileFromContentBase (contentBase, urlPath, callback) {
  try {
    let filePath = resolve(contentBase[0] || '.', '.' + urlPath)
    if (urlPath.endsWith('/')) {
      filePath = resolve(filePath, 'index.static.pug')
    } else if(urlPath.endsWith('.html')) {
      filePath = filePath.replace(/html/, '') + 'static.pug'
    }

    // Load index.html in directories
    if(filePath.endsWith('.pug')) {
      console.log('views', views);
      const view = Object.values(views).find(view => {
        const id = view.id.replace(/(.*src\/)/, '').replace(/(views\/)/, '')
        return id === cleanId(filePath)
      })
      pug.renderFile(filePath, pugOptions, function(error, content) {
        if(error) console.log(error);
        console.log('view.styles', view.styles);
        
        const source = content
        .replace(/[<]\/body>/gm, setScripts(view.scripts) + '</body>') 
        .replace(/[<]\/head>/gm, setStyles(view.styles) + '</head>')
        
        callback(error, source, filePath.replace(pattern, '.html'))
      })
    }
    else {
      readFile(filePath, (error, content) => {
        if (error && contentBase.length > 1) {
          // Try to read from next contentBase
          readFileFromContentBase(contentBase.slice(1), urlPath, callback)
        } else {
          // We know enough
          callback(error, content, filePath)
        }
      })
    }
  }
  catch(ex) {
    console.log('ex', ex);
  }
}
// tnego que poner la variable de dev en el transform
// si es dev tiene que convertir los pug a pug en dist, sino que les haga build a html con pug, posiblemente quitar el pug plugin
function notFound (response, filePath) {
  response.writeHead(404)
  response.end('404 Not Found' +
    '\n\n' + filePath +
    '\n\n(rollup-plugin-serve)', 'utf-8')
}

function found (response, filePath, content) {
  response.writeHead(200, { 'Content-Type': mime.getType(filePath) || 'text/html' })
  response.end(content, 'utf-8')
}

function green (text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}

function closeServerOnTermination () {
  const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP']
  console.log('closeServerOnTermination');
  terminationSignals.forEach(signal => {
    process.on(signal, () => {
      if (server) {
        server.close()
        process.exit()
      }
    })
  })
}

export default serve