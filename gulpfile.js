/*------------ plugins -----------------*/
var
	gulp         = require('gulp'),
	jade         = require('gulp-jade'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync  = require('browser-sync').create(),
	plumber      = require('gulp-plumber');

/*---------------- paths ----------------------*/

var
	paths = {
		jade : {
			locations   : 'jade/index.jade',
			destination : ''
		},

		scss : {
			locations   : 'sass/**/*.scss',
			compiled    : 'sass/main.scss',
			destination : 'css'
		},

		browserSync : {
			baseDir   : '',
			watchPaths : ['*.html', 'css/*.css', 'js/*.js' ]
		},

		build : 'dist/*'
	};

/*---------------- jade ------------------------*/

gulp.task('jade', function() {
	gulp.src(paths.jade.locations)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/*-------------- sass -------------------*/

gulp.task('sass', function() {
	gulp.src(paths.scss.compiled)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers : [ '> 1%', 'last 2 versions', 'ie >=9']
		}))
		.pipe(gulp.dest(paths.scss.destination))
});

/*---------- browser-sync -----------*/

gulp.task('sync', function () {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

/*--------------- build ------------------*/

gulp.task('build', ['jade','sass']);


/*-------------- watch ---------------*/ 

gulp.task('watch', function() {
	gulp.watch(paths.jade.locations, ['jade']);
	gulp.watch(paths.scss.locations, ['sass']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/*------------------ default ------------*/

gulp.task('default', ['build', 'watch', 'sync']); 