const fs = require('fs');
const beautify = require('json-beautify');
const mkdirp = require('mkdirp');
const isEmpty = require('lodash.isempty');

const saveFile = (output, content) => {
	fs.writeFileSync(output, beautify(content, null, 4, 100));
};

const readFile = (pathname) => {
	try {
		const contents = fs.readFileSync(pathname, 'utf-8');
		return JSON.parse(contents);
	} catch (err) {
		console.log(err);
		return {};
	}
};

const baseLangDir = './src/config/lang/en.json';
const targetLangDir = './src/config/lang/fa.json';

const isObject = (input) =>
	typeof input === 'object' && !Array.isArray(input) && input !== null;

const compare = (base = {}, target = {}) => {
	const diff = {};
	Object.entries(base).forEach(([key, value]) => {
		if (!target || !target.hasOwnProperty(key) || !target[key]) {
			diff[key] = value;
		} else {
			if (isObject(value)) {
				if (isObject(target[key])) {
					const comparissonResult = compare(value, target[key]);
					if (!isEmpty(comparissonResult)) {
						diff[key] = compare(value, target[key]);
					}
				} else {
					diff[key] = value;
				}
			}
		}
	});

	return diff;
};

if (!fs.existsSync('diff')) {
	mkdirp.sync('diff');
}

const diff = compare(readFile(baseLangDir), readFile(targetLangDir));

saveFile(`diff.json`, diff);
