'use strict';

var gulp = require('gulp');

var npmPackage = require('./package.json');

// Parses less files to css files
var less = require('gulp-less');

// Only passes the files which are changed
var changed = require('gulp-changed');

// Adds the vendor prefixes (like -webkit -moz etc) into the css
var autoprefixer = require('autoprefixer-core');

// Binds js files, makes import possible
var browserify = require('browserify');

// Keeps track of which files should be watched
var watchify = require('watchify');

// Makes it easier to use browserify with gulp (prevent unecessary overhead)
var source = require('vinyl-source-stream');

// changes vinyl-source-stream to a buffer
var buffer = require('vinyl-buffer');

// Wrapper around esling to work with gulp
var eslint = require('gulp-eslint');

// Converts ES6 to ES5
var babelify = require('babelify');

// Deletes a file or directory
var del = require('del');

// Notify plugin, it does what is says
var notify = require('gulp-notify');

// Keeps browsers and devices in sync with latest changes in your code
var browserSync = require('browser-sync');

// Gulp plugin to pipe CSS through several processors, but parse CSS only once.
var postcss = require('gulp-postcss');

// Optimize PNG, JPG, GIF, SVG images
var image = require('gulp-image');

var runSequence = require('run-sequence');
var csso = require('gulp-csso');
var zip = require('gulp-zip');

var reload = browserSync.reload;
var config = {
    jsx: './scripts/app.jsx',
    less: 'styles/*.less',
    mainLess: 'styles/main.less',
    bundle: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distHtml: 'dist',
    distImg: 'dist/img',
    npmDir: './node_modules',
    distFonts: 'dist/fonts'
};

// Same as rm -rf dist
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});


// Sets up the browser sync task, which starts the plugin browsersync
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './dist/'
        },
        open: false
    });
});

// Sets up the task watchify,
// which configurates which files to watch and what to do when a file has changed.
gulp.task('watchify', function() {
    var bundler = watchify(browserify(config.jsx, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(config.bundle))
            .pipe(gulp.dest(config.distJs))
            .pipe(reload({
                stream: true
            }));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

// Tells browserify how to bundle all the files
gulp.task('browserify', function() {
    return browserify(config.jsx)
        .transform(babelify)
        .bundle()
        .pipe(source(config.bundle))
        .pipe(buffer())
        .pipe(gulp.dest(config.distJs));
});

// Parses and process the style files (from less to css)
gulp.task('styles', function() {
    return gulp.src(config.mainLess)
        .pipe(changed(config.distCss))
        .pipe(less({
            paths: [config.npmDir + '/bootstrap/less/',
            config.npmDir + '/react-datepicker/dist/']
        }))
        .on('error', notify.onError())
        .pipe(postcss([autoprefixer('last 1 version')]))
        .pipe(gulp.dest(config.distCss))
        .pipe(reload({
            stream: true
        }));
});

// Copies all the html files to the dist directory
gulp.task('html-copy', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest(config.distHtml))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts', function(){
    return gulp.src(config.npmDir + '/bootstrap/fonts/**')
        .pipe(gulp.dest(config.distFonts));
});

// Copies all the files under img/ to the dist/img directory
gulp.task('image', function() {
    return gulp.src('img/**')
        .pipe(image())
        .pipe(gulp.dest(config.distImg));
});

// Lint is used for detecting correct syntax and style
gulp.task('lint', function() {
    return gulp.src('scripts/**/*.jsx')
        .pipe(eslint())
        .pipe(eslint.format());
});

// Creates a zip file of the dist directory
gulp.task('zip', function(){
    return gulp.src('dist/**')
        .pipe(zip('dist-' + npmPackage.version + '.zip'))
        .pipe(gulp.dest('.'));
});

// Defines which directories/files should be watched for changes (first argument)
// Second argument defines which task should be run when a change occurs.
gulp.task('watchTask', function() {
    gulp.watch('index.html', ['html-copy']);
    gulp.watch(config.less, ['styles']);
    gulp.watch('scripts/**/*.jsx', ['lint']);
});

// The watch task.
// Copies the html/img files, watches for changes and sets up the automatic building of jsx files
gulp.task('watch', ['clean'], function() {
    gulp.start(['browserSync', 'watchTask', 'watchify', 'html-copy', 'styles', 'fonts','lint', 'image']);
});

// Creates a dist directory which can be run indepedant
gulp.task('build', ['clean'], function(cb) {
    process.env.NODE_ENV = 'production';
    runSequence(['browserify', 'styles', 'html-copy', 'image', 'fonts'], cb);
});

// Creates a zip file which is deployable
gulp.task('deploy', function(cb){
    runSequence('build', 'zip', 'clean', cb);
})

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});
