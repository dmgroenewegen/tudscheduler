'use strict';

var gulp = require('gulp');

var npmPackage = require('./package.json');
var less = require('gulp-less');
var changed = require('gulp-changed');
var autoprefixer = require('autoprefixer-core');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var babelify = require('babelify');
var del = require('del');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var postcss = require('gulp-postcss');
var image = require('gulp-image');
var versionAppend = require('gulp-version-append');
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

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './dist/'
        },
        open: false
    });
});

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

gulp.task('browserify', function() {
    return browserify(config.jsx)
        .transform(babelify)
        .bundle()
        .pipe(source(config.bundle))
        .pipe(buffer())
        .pipe(gulp.dest(config.distJs));
});

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

gulp.task('html-copy', function() {
    return gulp.src('index.html')
        .pipe(versionAppend(['js','css']))
        .pipe(gulp.dest(config.distHtml))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts', function(){
    return gulp.src(config.npmDir + '/bootstrap/fonts/**')
        .pipe(gulp.dest(config.distFonts));
});

gulp.task('image', function() {
    return gulp.src('img/**')
        .pipe(image())
        .pipe(gulp.dest(config.distImg));
});

gulp.task('lint', function() {
    return gulp.src('scripts/**/*.jsx')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('zip', function(){
    return gulp.src('dist/**')
        .pipe(zip('dist-' + npmPackage.version + '.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('watchTask', function() {
    gulp.watch('index.html', ['html-copy']);
    gulp.watch(config.less, ['styles']);
    gulp.watch('scripts/**/*.jsx', ['lint']);
});

gulp.task('watch', ['clean'], function() {
    gulp.start(['browserSync', 'watchTask', 'watchify', 'html-copy', 'styles', 'fonts','lint', 'image']);
});

gulp.task('build', ['clean'], function(cb) {
    process.env.NODE_ENV = 'production';
    runSequence(['browserify', 'styles', 'html-copy', 'image', 'fonts'], cb);
});

gulp.task('deploy', function(cb){
    runSequence('build', 'zip', 'clean', cb);
})

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});
