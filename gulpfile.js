
/*
 * Copyright © 2018. All rights reserved.
 *
*/


const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: [
    'gulp-*', 'gulp.*'
  ],
  replaceString: /\bgulp[\-.]/
});
const appDev = './ui/';
const appProd = './dist/';

gulp.task('build-ibm', () =>
  gulp.src(appDev + 'ibm/*.js')
    .pipe(gulp.dest(appProd + 'ibm'))
);

gulp.task('build-css', ['build-fonts'], () =>
  gulp.src(appDev + 'css/*.css')
    .pipe($.cleanCss())
    .pipe(gulp.dest(appProd + 'css/'))
    .pipe($.size({'title': 'css'}))
);

gulp.task('build-fonts', () =>
  gulp.src([appDev + 'fonts/**'])
    .pipe(gulp.dest(appProd + 'fonts'))
);

gulp.task('build-html', [ 'build-img', 'build-css', 'build-ibm'], () => {
  const assets = $.useref({ 'searchPath': ['ui/**/*.*', 'node_modules'] });

  return gulp.src(appDev + 'index.html')
    .pipe(assets) //node_modules dir is in the current dir, search there for dependencies!
    .pipe($.sourcemaps.init({'identityMap': true, 'debug': true}))
    .pipe($.useref())
    .pipe(gulp.dest(appProd))
    .pipe($.size({'title': 'html'}));
});

gulp.task('build-img', () =>
  gulp.src(appDev + 'images/**/*')
    .pipe(gulp.dest(appProd + 'images/'))
);

gulp.task('clean', () =>
  gulp.src(appProd, { read: false })
    .pipe($.clean())
);

gulp.task('watch', ['build-html'], () => {
  gulp.watch(appDev + '**/*.js', ['build-html']);
  gulp.watch(appDev + 'css/*.css', ['build-html']);
  gulp.watch(appDev + '**/*.html', ['build-html']);
  gulp.watch(appDev + 'images/**/*', ['build-html']);
});

gulp.task('server:start', () =>
  $.developServer.listen({path: './server.js'})
);

gulp.task('server:watch', ['build-html', 'server:start', 'watch']);
gulp.task('default', ['build-html']);