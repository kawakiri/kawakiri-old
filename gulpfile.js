import gulp from 'gulp';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import { rollup } from 'rollup';
import babel from 'gulp-babel';
import terser from 'gulp-terser';

gulp.task('css', () => {
    return gulp.src('dist/css/kawakiri.css')
        .pipe(rename('kawakiri.min.css'))
        .pipe(postcss([
            csso()
        ]))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js:bundle', () => {
    return rollup({
        input: 'src/js/kawakiri.js',
    }).then(bundle => {
        return bundle.write({
            file: 'dist/js/kawakiri.js',
            format: 'iife'
        });
    });
});

gulp.task('js:transform', () => {
    return gulp.src('dist/js/kawakiri.js')
        .pipe(babel({
            presets: [
                [
                    '@babel/preset-env',
                    {
                        loose: true,
                        modules: false
                    }
                ]
            ]
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js:minify', () => {
    return gulp.src('dist/js/kawakiri.js')
        .pipe(rename('kawakiri.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js', gulp.series(
    'js:bundle',
    'js:transform',
    'js:minify'
));

gulp.task('build', gulp.series(
    'css',
    'js'
));
