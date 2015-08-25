# How to work

All files for production are compiled with [Grunt]. CSS compiled with [PostCSS]. JavaScript libs and plugins are concatenated to the single file. Images are optimized and SVG compiled to SVG-sprite. HTML just copied.

## Setup

1. Install [Node.js].
2. Install [Grunt] CLI and [Bower]:

		$ npm install -g grunt-cli
		$ npm install -g bower

3. Install development modules:

		$ npm install
		$ bower install

4. Run `grunt build`.

## Folders structure

`root` — configs and dependencies.

`build` — destination directory. There would be generated assets. Shouldn't be in repository.

`dev` — source directory for everything:

* dev root — HTML.
* `img` — images.
	* `img/svg-sprites` — svg for svg sprite.
	* `img/temp` — temporary images. They don't go to production and for demonstration purpose only.
* `js` — JavaScript.
	* `js/libs` — JavaScript libraries and plugins, that can't be installed via bower or npm.
* `pcss` — PostCSS files.

## Generate assets

Start watching service which generates _dev_ version on each source file change, also this start local webserver with autoreload:

	$ grunt

Generate _production_ (minified and optimized) version:

	$ grunt build

## Other Grunt-tasks

**test** — check JavaScript code style in scripts.js and Gruntfile.js.

**compress** — make .zip:

* **all** — sources and compiled files.
* **markup** — only compiled
* **source** — only sources

**deploy** — upload files to the server.

[Grunt]: http://gruntjs.com/
[PostCSS]: https://github.com/postcss/postcss/
[Node.js]: https://nodejs.org/
[Bower]: http://bower.io/
