const watch = process.env.NODE_ENV === 'production' ? false : true;
const ignore_watch = ['logs', 'node_modules', 'tools', 'db/functions', 'db/triggers', 'storage', 'package.json', 'package.json.*', 'package-lock.json', 'package-lock.json.*'];
const max_memory_restart = '4000M';
const node_args = ['--max_old_space_size=4096'];
const mode = process.env.DEPLOYMENT_MODE || 'all';
const { initializeMode } = require('./utils');

const api = {
	name      : 'api',
	script    : 'app.js',
	error_file: '/dev/null',
	out_file: '/dev/null',
	watch,
	ignore_watch,
	exec_mode : 'cluster',
	instance_var: 'INSTANCE_ID',
	instances : '1',
	max_memory_restart,
	node_args,
	env: {
		COMMON_VARIABLE: 'true',
		PORT: process.env.PORT || 10010
	}
};

const ws = {
	// ws application
	name      : 'ws',
	script    : 'ws/index.js',
	error_file: '/dev/null',
	out_file: '/dev/null',
	watch,
	ignore_watch: ignore_watch.concat(['tools', 'queue']),
	max_memory_restart,
	node_args,
	env: {
		COMMON_VARIABLE: 'true',
		PORT: process.env.WEBSOCKET_PORT || 10080
	}
};

const plugins = {
	// plugins application
	name      : 'plugins',
	script    : 'plugins/index.js',
	error_file: '/dev/null',
	out_file: '/dev/null',
	watch,
	ignore_watch,
	exec_mode : 'cluster',
	instance_var: 'INSTANCE_ID',
	instances : '1',
	max_memory_restart,
	node_args,
	env: {
		COMMON_VARIABLE: 'true',
		PORT: process.env.PLUGIN_PORT || 10011
	}
};

var apps = [];
const modes = initializeMode(mode);
for (let m of modes) {
	if (m === 'all') {
		apps = [api, ws, plugins];
		break;
	} else if (m === 'api') {
		apps.push(api);
	} else if (m === 'ws') {
		apps.push(ws);
	} else if (m === 'plugins') {
		apps.push(plugins);
	}
}

module.exports = {
	/**
		* Application configuration section
		* http://pm2.keymetrics.io/docs/usage/application-declaration/
	*/
	apps
};
