import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, {
    reload
}
from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import htmlReplace from 'gulp-html-replace';
import imagemin from 'gulp-imagemin';
// import pngquant from 'imagemin-pngquant';
import runSequence from 'run-sequence';
import ghPages from 'gulp-gh-pages';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import versionAppend from 'gulp-version-append';

const paths = {
    bundle: 'app.js',
    entry: 'src/Index.js',
    srcCss: 'src/styles/main.less',
    // srcImg: 'src/images/**',
    srcLint: ['src/**/*.js', 'test/**/*.js'],
    npmDir: 'node_modules',
    dist: 'dist',
    distCss: 'dist/styles',
    distJs: 'dist/js',
    // distImg: 'dist/images',
    distDeploy: './dist/**/*'
};

const customOpts = {
    entries: [paths.entry],
    debug: true,
    cache: {},
    packageCache: {}
};

const opts = Object.assign({}, watchify.args, customOpts);

gulp.task('clean', cb => {
    rimraf('dist', cb);
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watchify', () => {
    const bundler = watchify(browserify(opts));

    function rebundle() {
        return bundler.bundle()
            .on('error', notify.onError())
            .pipe(source(paths.bundle))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.distJs))
            .pipe(reload({
                stream: true
            }));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

gulp.task('browserify', () => {
    browserify(paths.entry, {
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source(paths.bundle))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distJs));
});

gulp.task('styles', function() {
    return gulp.src(paths.srcCss)
        .pipe(less({
            paths: [paths.npmDir + '/bootstrap/less/']
        }))
        .on('error', notify.onError())
        .pipe(postcss([autoprefixer('last 1 version')]))
        .pipe(gulp.dest(paths.distCss))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('htmlReplace', () => {
    gulp.src('index.html')
        .pipe(htmlReplace({
            css: 'styles/main.css?v=@version@',
            js: 'js/app.js?v=@version@'
        }))
        .pipe(versionAppend(['js', 'css']))
        .pipe(gulp.dest(paths.dist));
});

// gulp.task('images', () => {
//   gulp.src(paths.srcImg)
//     .pipe(imagemin({
//       progressive: true,
//       svgoPlugins: [{ removeViewBox: false }],
//       use: [pngquant()]
//     }))
//     .pipe(gulp.dest(paths.distImg));
// });

gulp.task('lint', () => {
    gulp.src(paths.srcLint)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('watchTask', () => {
    gulp.watch(paths.srcCss, ['styles']);
    gulp.watch(paths.srcLint, ['lint']);
});

gulp.task('deploy', () => {
    gulp.src(paths.distDeploy)
        .pipe(ghPages());
});

gulp.task('watch', cb => {
    runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'styles', 'lint'], cb);
});

gulp.task('build', cb => {
    process.env.NODE_ENV = 'production';
    runSequence('clean', ['browserify', 'styles', 'htmlReplace'], cb);
});
