const swaggerJSDoc = require('swagger-jsdoc');

const definition = {
	swagger: '2.0',
	info: {
		title: 'HollaEx Kit',
		version: '2.5.0'
	},
	host: 'api.hollaex.com',
	basePath: '/v2',
	schemes: ['http', 'https'],
	consumes: ['application/json'],
	produces: ['application/json', 'text/csv', 'text/plain'],
	securityDefinitions: {
		Token: {
			description: 'Auth Token',
			type: 'apiKey',
			name: 'token',
			in: 'header'
		}
	}
};

const options = {
	definition,
	apis: ['./**/*.yaml']
};


const excludePaths = ['id', '$schema', 'description', 'type', 'required', 'properties', 'patternProperties', 'additionalProperties', '$id', '$ref', '$defs', 'anyOf', 'unevaluatedProperties', 'swagger', 'info', 'host', 'basePath', 'schemes', 'version', 'services', 'networks', 'name', 'author', 'repository', 'bugs', 'homepage', 'devDependencies', 'scripts', 'keywords', 'license'];
const excludeDefinitions = ['Reference', 'Info', 'Contact', 'License', 'Server', 'ServerVariable', 'Components', 'Schema', 'Discriminator', 'XML', 'Response', 'MediaType', 'Example', 'Header', 'Paths', 'PathItem', 'Operation', 'Responses', 'SecurityRequirement', 'Tag', 'ExternalDocumentation', 'ExampleXORExamples', 'SchemaXORContent', 'Parameter', 'ParameterLocation', 'RequestBody', 'SecurityScheme', 'APIKeySecurityScheme', 'HTTPSecurityScheme', 'OAuth2SecurityScheme', 'OpenIdConnectSecurityScheme', 'OAuthFlows', 'ImplicitOAuthFlow', 'PasswordOAuthFlow', 'ClientCredentialsFlow', 'AuthorizationCodeOAuthFlow', 'Link', 'Callback', 'Encoding'];

const swaggerDoc = swaggerJSDoc(options);

swaggerDoc.consumes = ['application/json'];
swaggerDoc.produces = ['application/json', 'text/csv', 'text/plain'];

excludePaths.forEach((path) => {
	delete swaggerDoc.paths[path];
});

excludeDefinitions.forEach((definitions) => {
	delete swaggerDoc.definitions[definitions];
});


module.exports = swaggerDoc;