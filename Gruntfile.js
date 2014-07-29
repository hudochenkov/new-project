module.exports = function(grunt) {

	grunt.initConfig({

		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '/*\n' +
					        'Author:     Aleks Hudochenkov\n' +
					        'Release:    <%= grunt.template.today("dd.mm.yyyy") %>\n' +
					        '-----------------------------------------------------------------------------*/\n'
				},
				files: {
					src: [ 'main.css' ]
				}
			}
		},

		sass: {
			dev: {
				files: {
					'main.css': 'sass/main.scss'
				},
				options: {
					sourcemap: false,
					unixNewlines: true,
					style: 'expanded'
				}
			},
			debug: {
				files: {
					'main.css': 'sass/main.scss'
				},
				options: {
					sourcemap: true,
					unixNewlines: true,
					style: 'expanded'
				}
			},
			dist: {
				files: {
					'main.css': 'sass/main.scss'
				},
				options: {
					sourcemap: false,
					unixNewlines: true,
					style: 'compressed'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions', '> 1%']
			},
			dev: {
				src: 'main.css',
				options: {
					map: false
				}
			},
			debug: {
				src: 'main.css',
				options: {
					map: true
				}
			},
			dist: {
				src: 'main.css',
				options: {
					map: false
				}
			}
		},

		sprite: {
			buildretina: {
				'src': ['img/sprite/*@2x.png'],
				'destImg': 'img/sprite@2x.png',
				'destCSS': 'sass/_sprite.scss',
				'algorithm': 'binary-tree',
				'padding': 20,
				'engine': 'auto'
			},
			build: {
				'src': ['img/sprite/*.png', '!<%= sprite.buildretina.src %>'],
				'destImg': 'img/sprite.png',
				'padding': 10,
				'cssTemplate': '../spritesmith-retina-mixins.template.mustache',

				'cssVarMap': function (sprite) {
					sprite.image = sprite.image.replace(".png", "");
				},
				'algorithm': '<%= sprite.buildretina.algorithm %>',
				'destCSS': '<%= sprite.buildretina.destCSS %>',
				'engine': '<%= sprite.buildretina.engine %>'
			}
		},

		watch: {
			sass: {
				files: ['sass/*.scss'],
				tasks: ['sass:dev', 'autoprefixer:dev'],
			},
			sprites: {
				files: ['img/sprite/*.png'],
				tasks: ['sprite'],
			},
			livereload: {
				// Here we watch the files the sass task will compile to
				// These files are sent to the live reload server after sass compiles to them
				files: ['main.css'],
				options: { livereload: true },
			}
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['sass:dev', 'autoprefixer:dev', 'watch']);
	grunt.registerTask('debug', ['sass:debug', 'autoprefixer:debug', 'watch']);
	grunt.registerTask('build', ['sprite', 'sass:dist', 'autoprefixer:dist', 'usebanner']);

};
