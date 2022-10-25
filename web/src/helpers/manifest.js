import merge from 'lodash.merge';

const DEFAULT_MANIFEST = {
	short_name: 'hollaex',
	name: 'hollaex',
	icons: [
		{
			src: 'favicon.ico',
			sizes: '16x16',
			type: 'image/ico',
		},
	],
	start_url: './index.html',
	display: 'standalone',
	theme_color: '#000000',
	background_color: '#ffffff',
};

export const setupManifest = (overrides) => {
	try {
		const manifest = JSON.stringify(merge({}, DEFAULT_MANIFEST, overrides));
		const blob = new Blob([manifest], { type: 'application/json' });
		const manifestURL = URL.createObjectURL(blob);
		document
			.getElementById('manifest-placeholder')
			.setAttribute('href', manifestURL);
	} catch (err) {
		console.error('Failed to setup manifest', err);
	}
};
