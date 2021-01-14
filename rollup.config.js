import DevConfiguration from './rollup-config/dev'
import ProdConfiguration from './rollup-config/prod'

export default (args) => {
	if(args.environment === 'DEVELOPMENT') return DevConfiguration
	return ProdConfiguration
};