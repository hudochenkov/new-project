module.exports = function(grunt) {

	var project = {
		scssFolder: 'scss',
		scss: 'scss/main.scss',
		css: '../main.css',
		imgSrc: 'img',
		img: '../img',
		jsSrc: 'js',
		js: '../js'
	}

	grunt.initConfig({

		project: project,
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			options: {
				sourceMap: false,
				outputStyle: 'expanded'
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
					sourceMap: true
				}
			},
			dist: {
				files: {
					'<%= project.css %>': '<%= project.scss %>'
				},
				options: {
					outputStyle: 'compressed'
				}
			}
		},

		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer-core')({
						browsers: ['last 2 versions', '> 1%']
					})
				]
			},
			default: {
				src: '<%= project.css %>'
			},
			debug: {
				src: '<%= project.css %>',
				options: {
					map: true
				}
			}
		},

		usebanner: {
			default: {
				options: {
					position: 'top',
					banner: '/*\n' +
					        'Author:     Aleks Hudochenkov (hudochenkov.com)\n' +
					        'Version:    <%= grunt.template.today("dd.mm.yyyy") %>\n' +
					        '-----------------------------------------------------------------------------*/\n'
				},
				files: {
					src: [ '<%= project.css %>' ]
				}
			}
		},

		clean: {
			images: ['<%= project.img %>'],
			options: {
				force: true
			}
		},

		copy: {
			images: {
				files: [
					{
						expand: true,
						cwd: '<%= project.imgSrc %>/',
						src: ['**'],
						dest: '<%= project.img %>'
					}
				]
			}
		},

		concat: {
			options: {
				separator: '\n'
			},
			jslibs: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'<%= project.jsSrc %>/libs/*.js',
				],
				dest: '<%= project.js %>/libs.js'
			}
		},

		compress: {
			all: {
				options: {
					archive: '<%= pkg.name %>__markup-all__<%= grunt.template.today("yyyy-mm-dd--HH-MM") %>.zip'
				},
				files: [
					{
						expand: true,
						cwd: '../',
						src: [
							'**/*',
							'.gitignore',
							'dev/.bowerrc',
							'!**/node_modules/**',
							'!**/bower_components/**',
							'!**/_work-files/**',
							'!**/*.sublime-*',
							'!**/*.zip'
						]
					}
				]
			},
			markup: {
				options: {
					archive: '<%= pkg.name %>__markup-clean__<%= grunt.template.today("yyyy-mm-dd--HH-MM") %>.zip'
				},
				files: [
					{
						expand: true,
						cwd: '../',
						src: [
							'**/*',
							'!**/dev/**',
							'!README.md',
							'!**/*.sublime-*'
						]
					}
				]
			},
			source: {
				options: {
					archive: '<%= pkg.name %>__markup-source__<%= grunt.template.today("yyyy-mm-dd--HH-MM") %>.zip'
				},
				files: [
					{
						expand: true,
						cwd: '../',
						src: [
							'**/*',
							'.gitignore',
							'dev/.bowerrc',
							'!**/node_modules/**',
							'!**/bower_components/**',
							'!**/_work-files/**',
							'!**/*.sublime-*',
							'!**/*.zip',
							'!*.css',
							'!*.css.map',
							'!img/**',
							'!js/libs.js',
							'!dev/scss/_sprite.scss',
							'!dev/img/sprite.png',
							'!dev/img/sprite@2x.png'
						]
					}
				]
			}
		},

		'ftp-deploy': {
			all: {
				auth: grunt.file.exists(process.env.HOME + '/.grunt-ftp-deploy-config') ? grunt.file.readJSON(process.env.HOME + '/.grunt-ftp-deploy-config') : {},
				src: '../',
				dest: '/show/<%= pkg.name %>',
				exclusions: [
					'../**/.DS_Store',
					'../**/Thumbs.db',
					'../.git',
					'../.gitignore',
					'../*.sublime-*',
					'../README.md',
					'../dev',
				]
			}
		},

		imagemin: {
			default: {
				options: {
					optimizationLevel: 6
				},
				files: [{
					expand: true,
					cwd: '<%= project.imgSrc %>/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: '<%= project.img %>'
				}]
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

		browserSync: {
			bsFiles: {
				src: [
					'../*.html',
					project.js + '/*.js',
					project.img + '/**/*.{png,jpg,gif,svg}',
				]
			},
			options: {
				server: {
					baseDir: "../"
				},
				watchTask: true,
				notify: false,
				online: false,
				ghostMode: false
			}
		},

		bsReload: {
			css: {
				reload: "<%= project.css %>"
			}
		},

		watch: {
			options: {
				spawn: false
			},
			sass: {
				files: ['<%= project.scssFolder %>/*.scss'],
				tasks: ['sass:dev', 'postcss:default', 'bsReload:css'],
			},
			img: {
				files: ['<%= project.imgSrc %>/**/*.{png,jpg,gif,svg}'],
				tasks: ['newer:copy:images']
			},
			js: {
				files: ['<%= project.jsSrc %>/libs/*.js'],
				tasks: ['concat:jslibs']
			},
			// sprites: {
			// 	files: ['<%= project.img %>/sprite/*.png'],
			// 	tasks: ['sprite'],
			// }
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['newer:copy:images', 'concat:jslibs', 'sass:dev', 'postcss:default', 'browserSync', 'watch']);
	grunt.registerTask('debug', ['sass:debug', 'postcss:debug', 'browserSync', 'watch']);
	grunt.registerTask('build', ['clean:images', 'imagemin', 'concat:jslibs', 'sass:dist', 'postcss:default', 'usebanner']);

	// Deploy
	grunt.registerTask('deploy', ['ftp-deploy', 'showURL']);

	grunt.registerTask('showURL', 'Show upload folder URL', function() {

		var url = "http://hudochenkov.com/show/" + grunt.config("pkg.name") + "/";

		grunt.log.writeln("URL: " + url);

		// Copy URL to clipboard
		var proc = require('child_process').spawn('pbcopy');
		proc.stdin.write(url);
		proc.stdin.end();
	});

};
