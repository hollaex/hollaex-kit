const reactCacheGroupDeps = ['react', 'react-dom', 'react-router'];
const reduxCacheGroupDeps = [
	'redux',
	'react-redux',
	'redux-form',
	'redux-logger',
	'redux-thunk',
	'redux-promise-middleware',
	'reselect',
];

const phoneCacheGroupDeps = ['awesome-phonenumber', 'country-data'];

const momentCacheGroupDeps = ['moment', 'moment-jalaali', 'moment-timezone'];
const mathCacheGroupDeps = ['mathjs', 'numbro'];
const antdCacheGroupDeps = [
	'antd',
	'@ant-design/compatible',
	'@ant-design/icons',
];
const highchartsCacheGroupDeps = ['highcharts', 'highcharts-react-official'];

const getNodeModulesRegExp = (deps) =>
	new RegExp(`[\\/]node_modules[\\/]${deps.join('|')}`);

const excludeNodeModulesRegExp = (deps) =>
	new RegExp(`[\\/]node_modules[\\/](?!(${deps.join('|')})).*`);

const vendorCacheGroupDeps = [
	...reactCacheGroupDeps,
	...reduxCacheGroupDeps,
	...phoneCacheGroupDeps,
	...momentCacheGroupDeps,
	...mathCacheGroupDeps,
	...antdCacheGroupDeps,
	...highchartsCacheGroupDeps,
];

const SharedCacheGroup = {
	name: 'shared',
	test: getNodeModulesRegExp(vendorCacheGroupDeps),
};

const VendorCacheGroup = {
	name: 'vendor',
	test: excludeNodeModulesRegExp([...vendorCacheGroupDeps, 'emoji-mart']),
};

const cacheGroups = {
	[VendorCacheGroup.name]: VendorCacheGroup,
	[SharedCacheGroup.name]: SharedCacheGroup,
};

module.exports = function () {
	return {
		webpack: {
			configure: (webpackConfig, { env: webpackEnv, paths }) => {
				webpackConfig.optimization.splitChunks = {
					...webpackConfig.optimization.splitChunks,
					chunks: 'all',
					cacheGroups,
				};
				return webpackConfig;
			},
		},
	};
};
