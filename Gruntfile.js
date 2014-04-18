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

		watch: {
			sass: {
				files: ['sass/*.scss'],
				tasks: ['sass:dev', 'autoprefixer:dev'],
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
	grunt.registerTask('build', ['sass:dist', 'autoprefixer:dist', 'usebanner']);

};
