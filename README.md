# hollaex-node-lib
HollaEx crypto exchange nodejs library

## Deployment
You need to have `node` and `npm` installed and run `npm start`. You need to import `index.js` and instantiate your connection as explained in the usage section.

## Usage
```node
var client = new HollaEx();
```
You can pass your Access_Token generated from the site as follows:
```node
var client = new HollaEx({accessToken: MY_ACCESS_TOKEN});
```
There is a list of functions you can call which will be added later and they are not at this point implemented yet.

### getTicker

```node
var client = new HollaEx({accessToken: MY_ACCESS_TOKEN});
client.getTicker('btc-eur')
	.then(res => {
		let data = JSON.parse(res)
		console.log("The volume is", data.volume)
	})
	.catch(err => {
		console.log(err);
	});
```

## Example
You can run the example by going to example folder and running:
```node
node app.js
```

## Documentation
For adding additional functionalities simply go to index.js and add more features.
You can read more about api documentation at https://apidocs.hollaex.com
You should create your token on the platform in setting->api keys
