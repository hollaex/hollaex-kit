# hollaex-plugins

Usage:

1. Install dependencies:

	```bash
	npm install
	cd web/ && npm install
	```
2. Run `npm run build --plugin=<PLUGIN_NAME>` to generate plugin JSON object:

	```bash
	npm run build --plugin=hello-exchange

	/*
		{
			"name": "hello-exchange",
			"version": 1,
			"type": null,
			"author": "bitHolla",
			"bio": "Say hello from an exchange",
			"description": "Demo plugin for proof of concept",
			"documentation": null,
			"logo": null,
			"icon": null,
			"url": null,
			"meta": {
					"private": {
							"type": "string",
							"required": false,
							"description": "A secret",
							"value": "hello exchange..."
					}
			},
			"public_meta": {
					"public": {
							"type": "string",
							"required": false,
							"description": "Not a secret",
							"value": "Hello Exchange!"
					}
			},
			"prescript": {
					"install": [
							"hello-world-npm"
					],
					"run": null
			},
			"postscript": {
					"run": null
			},
			"web_view": null,
			"admin_view": null,
			"script": "const helloWorld=installedLibraries[\"hello-world-npm\"];app.get(\"/plugins/hello-exchange\",(e,l)=>l.json({publicMessage:publicMeta.public.value,privateMessage:meta.private.value,libraryMessage:helloWorld(),timestamp:moment().toISOString()}));"
		}
	*/
	```
