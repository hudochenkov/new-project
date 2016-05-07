var gulp = require('gulp');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync');
var del = require('del');
var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var header = require('gulp-header');
var cssnano = require('cssnano');
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');
var eslint = require('gulp-eslint');
var fs = require('fs');

var project = {
	src: 'dev',
	build: 'build',
	css: {
		src: 'dev/pcss/main.pcss',
		build: 'main.css',
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
		svgSprite: {
			src: 'svg-sprite/*.svg',
			build: 'build/img/sprite.svg'
		}
	}
};

var pkg = require('./package.json');

function handleError(err) {
	console.log(err.toString()); // eslint-disable-line no-console
	this.emit('end');
}

gulp.task('clean', function () {
	return del([project.build + '/**/*'], {
		dot: true
	});
});

var processors = [
	require('postcss-import')(),
	require('postcss-mixins')(),
	require('postcss-nested')(),
	require('postcss-simple-vars')(),
	require('postcss-property-lookup')(),
	require('postcss-assets')({
		basePath: 'dev'
	}),
	require('postcss-inline-svg')({
		path: 'dev'
	}),
	require('postcss-calc')(),
	require('postcss-hexrgba')(),
	require('postcss-custom-media')(),
	require('postcss-media-minmax')(),
	require('lost')(),
	require('autoprefixer')({
		browsers: ['last 2 versions', '> 1%', 'Android >= 4', 'iOS >= 8']
	})
];

gulp.task('styles:default', function () {
	return gulp.src(project.css.src)
		.pipe(postcss(processors))
		.on('error', handleError)
		.pipe(rename(project.css.build))
		.pipe(gulp.dest(project.build))
		.pipe(browserSync.stream());
});

gulp.task('styles:minify', function () {
	return gulp.src(project.build + '/' + project.css.build)
		.pipe(postcss([
			cssnano({
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
				minifyGradients: true,
				minifySelectors: true,
				normalizeCharset: true,
				normalizeUrl: false,
				orderedValues: false,
				reduceIdents: true,
				uniqueSelectors: true,
				zindex: true
			})
		]))
		.on('error', handleError)
		.pipe(gulp.dest(project.build));
});

gulp.task('styles:lint', function () {
	return gulp.src(project.css.dir + '*.pcss')
		.pipe(postcss([
			stylelint(),
			reporter({
				clearMessages: true,
				throwError: true
			})
		]));
});

gulp.task('styles',
	gulp.series(
		'styles:default',
		'styles:minify'
	)
);

gulp.task('js:lint', function () {
	return gulp.src([project.js.src + '/*.js', './gulpfile.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('copy:images', function () {
	return gulp.src(
		[
			project.img.src + '/' + project.img.allExtensions,
			'!' + project.img.src + '/' + project.img.svgSprite.src
		],
		{
			since: gulp.lastRun('copy:images')
		}
	)
		.pipe(gulp.dest(project.img.build))
		.pipe(browserSync.stream());
});

gulp.task('copy:html', function () {
	return gulp.src(project.src + '/*.html', { since: gulp.lastRun('copy:html') })
		.pipe(gulp.dest(project.build))
		.pipe(browserSync.stream());
});

gulp.task('copy:js', function () {
	return gulp.src(project.js.src + '/*.js', { since: gulp.lastRun('copy:js') })
		.pipe(gulp.dest(project.js.build))
		.pipe(browserSync.stream());
});

gulp.task('copy',
	gulp.parallel(
		'copy:images',
		'copy:html',
		'copy:js'
	)
);

gulp.task('concat', function () {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		project.js.src + '/libs/*.js'
	])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(project.js.build));
});

gulp.task('banner', function () {
	return gulp.src(project.build + '/' + project.css.build)
		.pipe(header(
			'/*\n' +
			'Author:     Aleks Hudochenkov (hudochenkov.com)\n' +
			'Version:    <%= date %>\n' +
			'-----------------------------------------------------------------------------*/\n',
			{
				date: new Date().toJSON().slice(0, 10).split('-').reverse().join('.')
			}
		))
		.pipe(gulp.dest(project.build));
});

gulp.task('upload', function () {
	function isFileExist(filePath) {
		try {
			fs.statSync(filePath);
		} catch (err) {
			if (err.code === 'ENOENT') {
				return false;
			}
		}

		return true;
	}

	var secret = isFileExist(process.env.HOME + '/.gulp-ftp.json') ? require(process.env.HOME + '/.gulp-ftp.json') : {};

	var connection = ftp.create({
		host: secret.host,
		port: secret.port,
		user: secret.username,
		password: secret.password,
		parallel: 8,
		log: gutil.log
	});

	var url = 'http://hudochenkov.com/show/' + pkg.name + '/';

	console.log('URL: ' + url); // eslint-disable-line no-console

	// Copy URL to clipboard
	var proc = require('child_process').spawn('pbcopy');

	proc.stdin.write(url);
	proc.stdin.end();

	return gulp.src(
		[project.build + '/**'],
		{
			base: './' + project.build,
			buffer: false
		}
	)
		.pipe(connection.newer('/show/' + pkg.name))
		.pipe(connection.dest('/show/' + pkg.name));
});

gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: project.build
		},
		notify: false,
		online: false,
		ghostMode: false
	});
});

gulp.task('watch', function () {
	gulp.watch([
		project.css.dir + '/*.pcss'
	], gulp.series('styles:default'));

	gulp.watch([
		project.img.src + '/' + project.img.allExtensions,
		'!' + project.img.src + '/' + project.img.svgSprite.src
	], gulp.series('copy:images'));

	gulp.watch([
		project.js.src + '/libs/*.js'
	], gulp.series('concat'));

	gulp.watch([
		project.js.src + '/*.js'
	], gulp.series('copy:js'));

	gulp.watch([
		project.src + '/*.html'
	], gulp.series('copy:html'));
});

gulp.task('default',
	gulp.series(
		gulp.parallel(
			'styles:default',
			'copy',
			'concat'
		),
		gulp.parallel(
			'server',
			'watch'
		)
	)
);

gulp.task('build',
	gulp.series(
		'clean',
		gulp.parallel(
			gulp.series(
				'styles:default',
				'styles:minify',
				'banner'
			),
			'concat',
			'copy'
		)
	)
);

gulp.task('lint',
	gulp.parallel(
		'styles:lint',
		'js:lint'
	)
);

gulp.task('deploy',
	gulp.series(
		'build',
		'upload'
	)
);
