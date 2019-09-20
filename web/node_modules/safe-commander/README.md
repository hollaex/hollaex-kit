# safe Commander.js

[![npm version](https://badge.fury.io/js/safe-commander.svg)](https://badge.fury.io/js/safe-commander)
[![npm downloads](https://img.shields.io/npm/dm/safe-commander.svg?style=flat-square)](https://www.npmjs.com/package/safe-commander)

[Commander.js](https://github.com/tj/commander.js/) has a major design flaw in the `option` API, such that options like `name`, `opts`, `command`, `option`, `domain` collide with names of properties on the commander instance. See issues: [#404](https://github.com/tj/commander.js/issues/404), [#584](https://github.com/tj/commander.js/issues/584), [#648](https://github.com/tj/commander.js/issues/648)

**Important:** `safe-commander` solves the name collision problem, however using it requires **[changing your code](#breaking-changes)**.

## Installation
    $ npm install safe-commander --save

## Usage
Follow Commander [API documentation](http://tj.github.com/commander.js/)

## Breaking changes
Options created with `option` API will no longer be available on the Commander instance object.  Instead, a new object store `optsObj` was added.

The original [Commander.js](https://github.com/tj/commander.js/#option-parsing) example should be modified as follows:

```diff
 #!/usr/bin/env node

 /**
  * Module dependencies.
  */

-var program = require('commander');
+var program = require('safe-commander');

 program
   .version('0.1.0')
   .option('-p, --peppers', 'Add peppers')
   .option('-P, --pineapple', 'Add pineapple')
   .option('-b, --bbq-sauce', 'Add bbq sauce')
   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
   .parse(process.argv);

 console.log('you ordered a pizza with:');
-if (program.peppers) console.log('  - peppers');
-if (program.pineapple) console.log('  - pineapple');
-if (program.bbqSauce) console.log('  - bbq');
-console.log('  - %s cheese', program.cheese);
+if (program.optsObj.peppers) console.log('  - peppers');
+if (program.optsObj.pineapple) console.log('  - pineapple');
+if (program.optsObj.bbqSauce) console.log('  - bbq');
+console.log('  - %s cheese', program.optsObj.cheese);
```

## Credits

### author
* [@bySabi](https://github.com/bySabi)

### contributors
* Ildar Sagdejev <> [@specious](https://github.com/specious)


## Contributing

* Improve the documentation
* Feel free to open any PR

## License

[MIT][mit-license]

[mit-license]:./LICENSE
