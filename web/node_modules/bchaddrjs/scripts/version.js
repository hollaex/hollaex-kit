/**
 * @license
 * https://github.com/bitcoincashjs/bchaddr
 * Copyright (c) 2018 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

var shell = require('shelljs')
shell.config.fatal = true

shell.exec('rm -rf dist')
shell.exec('npm run build')
shell.exec('git add -A dist')
shell.exec('npx mustache package.json README.tpl.md', { silent: true }).to('README.md')
shell.exec('git add -A README.md')
