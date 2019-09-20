# Notes

Bug fixes are documented as being part of the "next release" but are made immediately available in the patch releases.


# Releases

#### 1.2.0
  - Adds `--use-polling` flag to allow the use of polling.

#### 1.1.0
  - Adds `--skip-initial` flag to NOT build all the scss files when you first run node-sass-chokidar using the `--watch` flag.

#### 1.0.0
 - Switches `--watch` behavior to build all files before watching. Fixes [#31]
 - Removes `--recursive` flag since it didn't do anything.
 - Adds a `--match-regex` option that takes a regex and will ignore all files not matching the regular expression. [#40] and [#24]

#### 0.1.0
 - Features
     - [#9](https://github.com/michaelwayman/node-sass-chokidar/issues/9) add support for node 8 thanks to @anmonteiro
 - Bug fixes
    - [#5](https://github.com/michaelwayman/node-sass-chokidar/issues/5) where an error is raised when no input files are detected.
    - [#10](https://github.com/michaelwayman/node-sass-chokidar/issues/10) issue with `--watch` where changes to imported scss files from outside watch directory/file don't trigger rebuild

#### 0.0.1
First release
