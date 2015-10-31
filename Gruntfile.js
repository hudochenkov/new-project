module.exports = function(grunt) {
	grunt.initConfig({

		project: {
			src: 'dev',
			build: 'build',
			css: {
				src: 'dev/pcss/main.pcss',
				build: 'build/main.css',
				dir: 'dev/pcss/'
			},
			js: {
				src: 'dev/js',
				build: 'build/js'
			},
			img: {
				src: 'dev/img',
				build: 'build/img',
				allExtensions: '**/*.{png,jpg,gif,svg}',
				svgSprites: {
					src: 'svg-sprites/*.svg',
					build: 'build/img/sprite.svg'
				}
			}
		},
		pkg: grunt.file.readJSON('package.json'),

		postcss: {
			options: {
				map: false,
				processors: [
					require('postcss-import')(),
					require('postcss-mixins')(),
					require('postcss-nested')(),
					require('postcss-simple-vars')(),
					require('postcss-property-lookup')(),
					require('postcss-calc')(),
					require('postcss-color-function')(),
					require('autoprefixer')({
						browsers: ['last 4 versions', '> 1%', 'Android >= 4', 'iOS >= 7']
					})
				]
			},
			default: {
				src: '<%= project.css.src %>',
				dest: '<%= project.css.build %>'
			},
			minify: {
				options: {
					map: false,
					processors: [
						require('cssnano')({
							autoprefixer: false,
							calc: false,
							colormin: true,
							convertValues: false,
							discardComments: true,
							discardDuplicates: true,
							discardEmpty: true,
							discardUnused: true,
							mergeIdents: true,
							mergeLonghand: true,
							mergeRules: false,
							minifyFontValues: true,
							minifySelectors: true,
							normalizeCharset: true,
							normalizeUrl: false,
							orderedValues: false,
							reduceIdents: true,
							uniqueSelectors: true,
							zindex: true
						})
					]
				},
				src: '<%= project.css.build %>'
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
					src: ['<%= project.css.build %>']
				}
			}
		},

		clean: {
			build: [
				'<%= project.build %>'
			],
			options: {
				force: true
			}
		},

		copy: {
			images: {
				files: [
					{
						expand: true,
						cwd: '<%= project.img.src %>',
						src: ['**/**.*'],
						dest: '<%= project.img.build %>'
					}
				]
			},
			html: {
				files: [
					{
						expand: true,
						cwd: '<%= project.src %>',
						src: ['*.html'],
						dest: '<%= project.build %>'
					}
				]
			},
			js: {
				files: [
					{
						expand: true,
						cwd: '<%= project.js.src %>',
						src: ['*.js'],
						dest: '<%= project.js.build %>'
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
					'node_modules/jquery/dist/jquery.min.js',
					'<%= project.js.src %>/libs/*.js',
				],
				dest: '<%= project.js.build %>/libs.js'
			}
		},

		jscs: {
			default: {
				src: ['<%= project.js.src %>/scripts.js', 'Gruntfile.js']
			}
		},

		imagemin: {
			default: {
				options: {
					optimizationLevel: 6
				},
				files: [
					{
						expand: true,
						cwd: '<%= project.img.src %>/',
						src: ['<%= project.img.allExtensions %>', '!<%= project.img.svgSprites.src %>'],
						dest: '<%= project.img.build %>'
					}
				]
			}
		},

		svgstore: {
			options: {
				prefix: 'icon-',
				svg: {
					style: 'width: 0; height: 0; visibility: hidden;'
				}
			},
			dev: {
				files: {
					'<%= project.img.svgSprites.build %>': ['<%= project.img.src %>/<%= project.img.svgSprites.src %>']
				},
				options: {
					formatting: {
						indent_char: '	',
						indent_size: 1
					},
					includedemo: '<!doctype html><html><head><style>body{background: #eee;}svg{width:50px; height:50px; fill:black;}</style><head><body>\n{{{svg}}}\n\n{{#each icons}}<svg class="svg-icon"><use xlink:href="#{{name}}" /></svg>\n{{/each}}\n\n</body></html>\n'
				}
			},
			build: {
				files: {
					'<%= project.img.svgSprites.build %>': ['<%= project.img.src %>/<%= project.img.svgSprites.src %>']
				}
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
						src: [
							'**/*',
							'.editorconfig',
							'.gitignore',
							'.jscsrc',
							'!node_modules/**',
							'!**/_work-files/**',
							'!*.sublime-*',
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
						cwd: '<%= project.build %>',
						src: [
							'**/*'
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
						src: [
							'**/*',
							'.editorconfig',
							'.gitignore',
							'.jscsrc',
							'!<%= project.build %>/**',
							'!node_modules/**',
							'!**/_work-files/**',
							'!*.sublime-*',
							'!**/*.zip'
						]
					}
				]
			}
		},

		'ftp-deploy': {
			all: {
				auth: grunt.file.exists(process.env.HOME + '/.grunt-ftp-deploy-config') ? grunt.file.readJSON(process.env.HOME + '/.grunt-ftp-deploy-config') : {},
				src: '<%= project.build %>',
				dest: '/show/<%= pkg.name %>'
			}
		},

		browserSync: {
			bsFiles: {
				src: [
					'<%= project.build %>/*.html',
					'<%= project.js.build %>/*.js',
					'<%= project.img.build %>/**/*.{png,jpg,gif,svg}',
				]
			},
			options: {
				server: {
					baseDir: '<%= project.build %>'
				},
				watchTask: true,
				notify: false,
				online: false,
				ghostMode: false
			}
		},

		bsReload: {
			css: {
				reload: '<%= project.css.build %>'
			},
			all: {
				reload: true
			}
		},

		watch: {
			options: {
				spawn: false
			},
			pcss: {
				files: ['<%= project.css.dir %>/*.pcss'],
				tasks: ['postcss:default', 'bsReload:css'],
			},
			img: {
				files: ['<%= project.img.src %>/<%= project.img.allExtensions %>', '!<%= project.img.src %>/<%= project.img.svgSprites.src %>'],
				tasks: ['newer:copy:images', 'bsReload:all']
			},
			svgSprite: {
				files: ['<%= project.img.src %>/<%= project.img.svgSprites.src %>'],
				tasks: ['svgstore:dev', 'bsReload:all']
			},
			jslibs: {
				files: ['<%= project.js.src %>/libs/*.js'],
				tasks: ['concat:jslibs']
			},
			js: {
				files: ['<%= project.js.src %>/*.js'],
				tasks: ['copy:js']
			},
			html: {
				files: ['<%= project.src %>/*.html'],
				tasks: ['newer:copy:html']
			},
		}

	});

	require('jit-grunt')(grunt, {
		usebanner: 'grunt-banner'
	});

	grunt.registerTask('default', ['newer:copy', 'svgstore:dev', 'concat:jslibs', 'postcss:default', 'browserSync', 'watch']);
	// grunt.registerTask('debug', ['sass:debug', 'postcss:debug', 'browserSync', 'watch']);
	grunt.registerTask('test', ['jscs']);
	grunt.registerTask('build', ['clean', 'copy:js', 'copy:html', 'imagemin', 'svgstore:build', 'concat:jslibs', 'postcss:default', 'postcss:minify', 'usebanner']);

	// Deploy
	grunt.registerTask('deploy', ['ftp-deploy', 'showURL']);

	grunt.registerTask('showURL', 'Show upload folder URL', function() {
		var url = 'http://hudochenkov.com/show/' + grunt.config('pkg.name') + '/';

		grunt.log.writeln('URL: ' + url);

		// Copy URL to clipboard
		var proc = require('child_process').spawn('pbcopy');
		proc.stdin.write(url);
		proc.stdin.end();
	});
};
