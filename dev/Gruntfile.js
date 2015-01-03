var browserSync = require('browser-sync');

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
				auth: grunt.file.readJSON(process.env.HOME + '/.grunt-ftp-deploy-config'),
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

		watch: {
			options: {
				spawn: false
			},
			sass: {
				files: ['<%= project.scssFolder %>/*.scss'],
				tasks: ['sass:dev', 'autoprefixer:default', 'bs-inject'],
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

	// Init BrowserSync
	grunt.registerTask('bs-init', function () {
		var done = this.async();
		browserSync({
			server: '../',
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

	grunt.registerTask('default', ['newer:copy:images', 'concat:jslibs', 'sass:dev', 'autoprefixer:default', 'bs-init', 'watch']);
	grunt.registerTask('debug', ['sass:debug', 'autoprefixer:debug', 'bs-init', 'watch']);
	grunt.registerTask('build', ['clear:images', 'imagemin', 'concat:jslibs', 'sass:dist', 'autoprefixer:default']);

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
