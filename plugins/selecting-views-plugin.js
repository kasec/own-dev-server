export default function pugToHtml (options) {
    const { pattern = /\.view\.(?:pug)$/, stylesDir } = options;
    let _stylesDir = stylesDir || ''
    return {
      name: 'pug-to-html',  // this name will show up in warnings and errors
      // options(options) {
      //   if(!options.output[0].dir) throw "'dir' prop in output object must be defined"
        
      //   _stylesDir = path.join(options.output[0].dir, _stylesDir)
      // },
      transform(code, id) {
        if(pattern.test(id) && code) {
          const source = code
          .replace(/^(export default ")/, "") // quit export default text
          .replace(/"(;)$/gm, '') // quit last "; from last
          .replace(/\\"/gm,"\"") // replace \" once its found
          .replace(/\\n/gm, ' ') // replace \n once its found with space
          .replace(/\"[^"]+\.css\"/gm, _stylesDir + '/bundle.css') //replace .css route with absolute path in output folder
          const fileName = id.replace(/(.*src\/)/, '').replace(pattern, '.html')
            // console.log('source', source);
            
             
            
            const htmlFile = {
                type: 'asset',
                source,
                name: fileName,
                fileName
            };
            // return { code: source, map: { mappings: "" }}
            this.emitFile(htmlFile);            
        }
      },
    }
}