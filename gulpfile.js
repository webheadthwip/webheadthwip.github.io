/**
 * Required modules
 */
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');


/**
 * Compile SASS files
 */
gulp.task('sass', function() {
	var sourceFile = './sass/**/*.scss';
	var destination = './css';

	return buildCss(sourceFile, destination);
});

/**
 * Minimize "framework" JavaScript
 */
gulp.task('js', function() {
	var sourceFile = './js/index.js';
	var destinationDir = './js/build';
	var destinationFile = 'framework.min.js';

	return buildJs(sourceFile, destinationDir, destinationFile);
});

/**
 * File watcher
 */
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass']).on('change', logTime);
	gulp.watch(['js/**/*.js', '!js/build/*.js'], ['js']).on('change', logTime);
});

/**
 * Default task
 */
gulp.task('default', ['sass', 'js', 'watch']);

/**
 * Handle Sass-to-CSS
 * @param  {string} source      The location of Sass files.
 * @param  {string} destination The desired location of the compiled CSS file.
 * @return {stream}
 */
function buildCss(sourceFile, destination) {
	var sassConfig = gutil.env.production ? {
		outputStyle: 'compressed'
	} : {
		outputStyle: 'nested'
	};
	var processors = [
		autoprefixer({
			browsers: ['last 10 version']
		})
	];

	return gulp.src(sourceFile)
		.pipe(gutil.env.production ? gutil.noop() : sourcemaps.init())
		.pipe(sass(sassConfig).on('error', handleErrors))
		.pipe(postcss(processors).on('error', handleErrors))
		.pipe(gutil.env.production ? gutil.noop() : sourcemaps.write())
		.pipe(size({
			showFiles: true,
			title: 'css'
		}))
		.pipe(gulp.dest(destination));
}

/**
 * Handle CommonJS module compilation.
 * @param  {string} source          The main JavaScript file.
 * @param  {string} destinationFile The filename for the compiled result.
 * @return {stream}
 */
function buildJs(sourceFile, destinationDir, destinationFile) {
	return browserify(sourceFile)
		.bundle()
		.on('error', handleErrors)
		.pipe(source(destinationFile))
		.pipe(buffer())
		.pipe(gutil.env.production ? uglify() : gutil.noop())
		.pipe(gulp.dest(destinationDir));
}

/**
 * Utility functions
 */
function handleErrors() {
	var args = Array.prototype.slice.call(arguments);

	console.log(args);

	// Send error to notification center with gulp-notify
	notify.onError({
		title: "Compilation Error",
		message: "<%= error.message %>"
	}).apply(this, args);

	gutil.beep();

	// Keep gulp from hanging on this task
	this.emit('end');
};

function logTime(event) {
	console.log('[' + getTheTime() + '] ' + 'File ' + event.path + ' was ' + event.type + ', running tasks...');
}

function getTheTime() {
	var now = new Date();
	return ((now.getHours() < 10) ? "0" : "") + now.getHours() + ":" + ((now.getMinutes() < 10) ? "0" : "") + now.getMinutes() + ":" + ((now.getSeconds() < 10) ? "0" : "") + now.getSeconds();
}