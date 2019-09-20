# node-sass-chokidar

[![Build Status](https://travis-ci.org/michaelwayman/node-sass-chokidar.svg?branch=master)](https://travis-ci.org/michaelwayman/node-sass-chokidar)

A thin wrapper around node-sass executable to use chokidar instead of Gaze when watching files.

All the functionality of the node-sass executable is still intact, the only difference being chokidar instead of Gaze for watching files.

Why? Because Gaze in docker and various virtual machines uses a lot of resources whereas chokidar does not.
Read about the advantages of [chokidar](https://github.com/paulmillr/chokidar)

When using `node-sass --watch` in docker for mac you will get really high CPU usage with com.docker.hyperkit and com.docker.osxfs (I've seen reports of up to 300%).
The cause of this is the node-sass dependency on [Gaze](https://github.com/shama/gaze). This package fixes this issue by using chokidar with node-sass instead of Gaze.

## Examples

```
# Build a directory
node-sass-chokidar ./src -o ./build

# Watch a directory:
node-sass-chokidar ./src -o ./build --watch

# Watch a directory, don't perform an initial build until a change has occured:
node-sass-chokidar ./src -o ./build --watch --skip-initial

# Watch a directory, include node_modules import path so we can import from there e.g. @import 'bulma/bulma.sass';
node-sass-chokidar --include-path ./node_modules/ ./src -o ./src --watch

# Build a file
node-sass-chokidar ./src/index.scss ./build/index.css

# Watch a single file and don't perform an initial build until a change has occured:
node-sass-chokidar ./src/index.scss ./build/index.css --watch --skip-initial
```

____

## Options
```
    -w, --watch                Watch a directory or file,
    -m, --match-regex          Only watches files in a directory that match the regular expression,
    -o, --output               Output directory,
    -x, --omit-source-map-url  Omit source map URL comment from output,
    -i, --indented-syntax      Treat data from stdin as sass code (versus scss),
    -q, --quiet                Suppress log output except on error,
    -v, --version              Prints version info,
    --ext,                     Custom output file extension,
    --skip-initial             Skips initial build when passing the --watch flag,
    --output-style             CSS output style (nested | expanded | compact | compressed),
    --indent-type              Indent type for output CSS (space | tab),
    --indent-width             Indent width; number of spaces or tabs (maximum value: 10),
    --linefeed                 Linefeed style (cr | crlf | lf | lfcr),
    --source-comments          Include debug info in output,
    --source-map               Emit source map,
    --source-map-contents      Embed include contents in map,
    --source-map-embed         Embed sourceMappingUrl as data URI,
    --source-map-root          Base path, will be emitted in source-map as is,
    --include-path             Path to look for imported files,
    --follow                   Follow symlinked directories,
    --precision                The amount of precision allowed in decimal numbers,
    --error-bell               Output a bell character on errors,
    --importer                 Path to .js file containing custom importer,
    --functions                Path to .js file containing custom functions,
    --use-polling              Watch using polling (chokidar's polling option),
    --polling-interval         Interval of filesystem folling if polling is being used,
    --help                     Print usage info
```

## Contributing

Feel free.
