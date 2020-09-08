// import html from '../src/index.pug'
// console.log(html);
var fs = require('fs');
var path = require('path')

import virtual from '@rollup/plugin-virtual';
import { promise as matched } from 'matched';

import { createFilter } from 'rollup-pluginutils'
const getViews = function(pathString, viewsArray = [], pattern ) {
  let _views = [...viewsArray]
  
  return fs.promises
      .readdir(pathString, {withFileTypes: true})
      .then(async (filenames) => {
        for(const file of filenames) {
          if(file.isDirectory()) {
            const v = await getViews(path.join(pathString, file.name), _views, pattern)
            _views = v
          }
          else if(pattern.test(file.name)) {
            _views = [..._views, file.name]
          }
        }
        return _views
      })
}
export default function pugToHtml (options) {
    const { rootDir = '', baseDir = '', pattern = /\.view\.(?:pug)$/, output, include, exclude } = options;

    const filter = createFilter(include || ['**/*.pug'], exclude || '');
    let views = [];
    
    const pathResolved = path.resolve(rootDir, baseDir)
    let virtualisedEntry;
    
    // console.log('views -> ', views)
    return {
      name: 'pug-to-html',  // this name will show up in warnings and errors
      async buildStart(id, importer) {
        const entries = await getViews(pathResolved, views, pattern).then(entries => entries.map(file => 'import ' + file))
        // console.log('entries', entries);
        
        virtualisedEntry = virtual({ [options.input]: entries });
      },
      resolveId(id, importer) {
        return virtualisedEntry && virtualisedEntry.resolveId(id, importer);
      },
      transform(code, id) {
        // console.log('somethin', id)
        if(filter(id)) {
          console.log(id)
        }
      },
    }
}