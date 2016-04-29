# How to work

All files for production are compiled with [Gulp]. CSS compiled with [PostCSS]. JavaScript libs and plugins are concatenated to the single file. Images are optimized. HTML just copied.

## Setup

1. Install [Node.js].
2. Install development modules:

		$ npm install

3. Run `npm run gulp build`.

## Folders structure

`root` — configs and dependencies.

`build` — destination directory. There would be generated assets. Shouldn't be in repository.

`dev` — source directory for everything:

* dev root — HTML.
* `img` — images.
	* `img/temp` — temporary images. They don't go to production and for demonstration purpose only.
* `js` — JavaScript.
	* `js/libs` — JavaScript libraries and plugins, that can't be installed via npm.
* `pcss` — PostCSS files.

## Generate assets

Start watching service which generates _dev_ version on each source file change, also this start local webserver with autoreload:

	$ npm run gulp

Generate _production_ (minified and optimized) version:

	$ npm run gulp build

## Other Gulp-tasks

**lint** — check code style in stylesheets.

**deploy** — upload files to the server.

[Gulp]: https://github.com/gulpjs/gulp/tree/4.0
[PostCSS]: https://github.com/postcss/postcss/
[Node.js]: https://nodejs.org/
