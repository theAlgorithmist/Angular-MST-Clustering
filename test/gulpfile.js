/**
 * Facilitate command-line testing of low-level functionality for the GAT
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
const gulp       = require('gulp');
const typescript = require('gulp-tsc');
const tscConfig  = require('./tsconfig.json');
const mocha      = require('gulp-mocha');

// compile the source code and test suite
gulp.task('compile', function () {
  return gulp
    .src(['./graph.specs.ts'], { base: "." })
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('.'))
});

gulp.task('test', function () {
  return gulp.src("./graph.specs.js", {read:false})
    .pipe(mocha({reporter:'spec'}));
});
