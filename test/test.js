function importTest(name, path) {
	describe(name, () => {
		require(path);
	});
}

describe('TESTS', () => {
	importTest('REST API', './REST/restApiTest.js');
	importTest('Websocket', './Websocket/websocketTest.js');
});
