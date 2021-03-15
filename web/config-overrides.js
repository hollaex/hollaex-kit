const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin({
	outputFormat: 'human',
	outputTarget: './measure.txt',
});

module.exports = function (config, env) {
	config = smp.wrap({
		...config,
	});
	return config;
};
