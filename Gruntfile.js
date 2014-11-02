module.exports = function(grunt) {

	var project = {
		scssFolder: 'scss',
		scss: 'scss/main.scss',
		css: 'main.css',
		img: 'img',
		js: 'js'
	}

	grunt.initConfig({

		project: project,

		sass: {
			options: {
				sourcemap: 'none',
				unixNewlines: true,
				style: 'expanded',
				banner: '/*\n' +
				        'Author:     Aleks Hudochenkov\n' +
				        'Release:    <%= grunt.template.today("dd.mm.yyyy") %>\n' +
				        '-----------------------------------------------------------------------------*/\n'
			},
			dev: {
				files: {
					'<%= project.css %>': '<%= project.scss %>'
				}
			},
			debug: {
				files: {
					'<%= project.css %>': '<%= project.scss %>'
				},
				options: {
					sourcemap: 'auto',
					banner: null
				}
			},
			dist: {
				files: {
					'<%= project.css %>': '<%= project.scss %>'
				},
				options: {
					style: 'compressed'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions', '> 1%']
			},
			default: {
				src: '<%= project.css %>',
				options: {
					map: false
				}
			},
			debug: {
				src: '<%= project.css %>',
				options: {
					map: true
				}
			}
		},

		// sprite: {
		// 	buildretina: {
		// 		'src': ['<%= project.img %>/sprite/*@2x.png'],
		// 		'destImg': '<%= project.img %>/sprite@2x.png',
		// 		'destCSS': '<%= project.scssFolder %>/_sprite.scss',
		// 		'algorithm': 'binary-tree',
		// 		'padding': 20,
		// 		'engine': 'auto'
		// 	},
		// 	build: {
		// 		'src': ['<%= project.img %>/sprite/*.png', '!<%= sprite.buildretina.src %>'],
		// 		'destImg': '<%= project.img %>/sprite.png',
		// 		'padding': 10,
		// 		'cssTemplate': '<%= project.scssFolder %>/spritesmith-retina-mixins.template.mustache',

		// 		'cssVarMap': function (sprite) {
		// 			sprite.image = sprite.image.replace(".png", "");
		// 		},
		// 		'algorithm': '<%= sprite.buildretina.algorithm %>',
		// 		'destCSS': '<%= sprite.buildretina.destCSS %>',
		// 		'engine': '<%= sprite.buildretina.engine %>'
		// 	}
		// },

		watch: {
			sass: {
				files: ['<%= project.scssFolder %>/*.scss'],
				tasks: ['sass:dev', 'autoprefixer:default'],
			}
			// sprites: {
			// 	files: ['<%= project.img %>/sprite/*.png'],
			// 	tasks: ['sprite'],
			// }
		}

	});

	// Start BrowserSync via the API
	// using this code because of bug related to autoprefixer https://github.com/shakyShane/grunt-browser-sync/issues/50
	var bs;
	grunt.registerTask("bs-start", function () {
		var browserSync = require("browser-sync");
		bs = browserSync.init([
			project.css,
			'*.html',
			project.js + '/*.js',
		], {
			server: {
				baseDir: "./"
			},
			notify: false
		})
	});

	// Fire file-change events manually for greater control
	grunt.registerTask("bs-reload", function () {
		bs.events.emit("file:changed", {path: project.css});
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['sass:dev', 'autoprefixer:default', 'bs-start', 'watch']);
	grunt.registerTask('debug', ['sass:debug', 'autoprefixer:debug', 'bs-start', 'watch']);
	grunt.registerTask('build', ['sass:dist', 'autoprefixer:default']);

};
