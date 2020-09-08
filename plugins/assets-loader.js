import path from 'path'
import { createFilter } from 'rollup-pluginutils'
export default function assetsLoader(options = {}) {
    const { include, exclude } = options
    const pngFilter = createFilter(include || ['**/*.png'], exclude || '');
    return {
        name: 'assets-loader',
        resolveId( id, importer ) {
            if(pngFilter(id)) {
                return path.resolve(path.dirname(importer), id)
            }
        },
        load(id) {
            if(pngFilter(id)) {
                return id
            }
        },
        transform(code, id) {
            
            if(pngFilter(id)) {
                let fileName = path.basename(id)
                const file = {
                    type: 'asset',
                    source: code,
                    name: fileName,
                    fileName
                };
                // return { code: source, map: { mappings: "" }}
                this.emitFile(file);
            }
            return { code: 'export default "image"', map: null };
        }
    }
}