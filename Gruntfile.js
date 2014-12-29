var browserSync = require('browser-sync');

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
			options: {
				spawn: false
			},
			sass: {
				files: ['<%= project.scssFolder %>/*.scss'],
				tasks: ['sass:dev', 'autoprefixer:default', 'bs-inject'],
			}
			// sprites: {
			// 	files: ['<%= project.img %>/sprite/*.png'],
			// 	tasks: ['sprite'],
			// }
		}

	});

	// Init BrowserSync
	grunt.registerTask('bs-init', function () {
		var done = this.async();
		browserSync({
			server: './',
			notify: false,
			online: false,
			ghostMode: {
				scroll: false
			},
			files: [
				'*.html',
				project.js + '/*.js',
				project.img + '/**/*.{png,jpg,gif,svg}',
			]
		}, function (err, bs) {
			done();
		});
	});

	// Inject CSS
	grunt.registerTask('bs-inject', function () {
		browserSync.reload([project.css]);
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['sass:dev', 'autoprefixer:default', 'bs-init', 'watch']);
	grunt.registerTask('debug', ['sass:debug', 'autoprefixer:debug', 'bs-init', 'watch']);
	grunt.registerTask('build', ['sass:dist', 'autoprefixer:default']);

};
