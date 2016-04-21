var gulp = require('gulp');
var concatFile = require('gulp-concat');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
gulp.task('bundle', function() {
    console.log('bundle Working!');
    return gulp.src(['./static/javascripts/{account,authentication,course,layout,components}/**/*.js', 
        './static/javascripts/{app,app.routes,main}.js'])
        .pipe(concatFile("test.js", {newLine: ','}))
        .pipe(gulp.dest('./static/javascripts/'));
});


gulp.task('watch', function () {
    watch('./static/javascripts/**/*.js', function(){
        gulp.start('bundle')
    });
});
gulp.task('default', ['watch'])

// gulp.task('bundle', function() {
//     return gulp.src('./js/**/*.js')
//         .pipe(amdOptimize('test', {
//             configFile: './js/require-config.js',
//             findNestedDependencies: true,
//             include: false
//         }))
//         .pipe(concatFile('test.js'))
//         // .pipe(uglifyJS('test.js'))
//         .pipe(gulp.dest('./jsbuild/'));
// });
//   jscs = require('gulp-jscs'),
//   eslint = require('gulp-eslint'),
//   ngAnnotate = require('gulp-ng-annotate'),
//   concat = require('gulp-concat'),
//   wrap = require('gulp-wrap'),
//   del = require('del'),
//   uglify = require('gulp-uglify'),
//   htmlreplace = require('gulp-html-replace'),
//   cssmin = require('gulp-cssmin'),
//   uuid = require('node-uuid');

// var production_version_uuid = '.' + uuid.v1();
// var wwwroot = './sgmwsales/public/';
// var paths = {
//   index: [wwwroot + 'index.html'],
//   scripts: [wwwroot + 'js/**/*.js', wwwroot + 'js/*.js'],
//   styles: [wwwroot + 'css/*.css'],
//   templates: [wwwroot + 'templates/**/*.html']
// };
// gulp.task('clean', function () {
//   return del([wwwroot + 'min']);
// });
// gulp.task('scriptsProduction', function () {
//   gulp.src(paths.scripts)
//     .pipe(ngAnnotate())
//     .pipe(concat('m.js'))
//     .pipe(wrap('(function(window){\n"use strict"\n<%= contents %>\n})(window);'))
//     .pipe(concat('app.min' + production_version_uuid + '.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest(wwwroot + 'min'));
// });
// gulp.task('scriptsDev', function () {
//   gulp.src(paths.scripts)
//     .pipe(ngAnnotate())
//     .pipe(concat('m.js'))
//     .pipe(wrap('(function(window){\n"use strict"\n<%= contents %>\n})(window);'))
//     .pipe(concat('app.js'))
//     .pipe(gulp.dest(wwwroot + 'min'));
// });
// gulp.task('stylesProduction', function () {
//   return gulp.src(paths.styles)
//     .pipe(concat('app.css'))
//     .pipe(cssmin())
//     .pipe(concat('app.min' + production_version_uuid + '.css'))
//     .pipe(gulp.dest(wwwroot + 'min'));
// });
// gulp.task('stylesDev', function () {
//   return gulp.src(paths.styles)
//     .pipe(concat('app.css'))
//     .pipe(gulp.dest(wwwroot + 'min'));
// });

// //替换页面的css和js加入
// gulp.task('templatesDev', function () {
//   gulp.src(paths.index)
//     .pipe(htmlreplace({
//       'js': '/min/app.js'
//     }, {
//       keepUnassigned: true,
//       keepBlockTags: true,
//       resolvePaths: false
//     }))
//     .pipe(htmlreplace({
//       'css': '/min/app.css'
//     }, {
//       keepUnassigned: true,
//       keepBlockTags: true,
//       resolvePaths: false
//     }))
//     .pipe(gulp.dest(wwwroot));
// });
// //替换页面的css和js加入uuid  生产环境
// gulp.task('templatesProduction', function () {
//   gulp.src(paths.index)
//     .pipe(htmlreplace({
//       'js': '/min/app.min' + production_version_uuid + '.js'
//     }, {
//       keepUnassigned: true,
//       keepBlockTags: true,
//       resolvePaths: false
//     }))
//     .pipe(htmlreplace({
//       'css': '/min/app.min' + production_version_uuid + '.css'
//     }, {
//       keepUnassigned: true,
//       keepBlockTags: true,
//       resolvePaths: false
//     }))
//     .pipe(gulp.dest(wwwroot));
// });

// // TODO edit lint src
// var lintSrc = ['gulpfile.js'];

// // JSCS
// gulp.task('jscs', function () {

//   return gulp.src(lintSrc)
//     .pipe(jscs())
//     .pipe(jscs.reporter());
// });

// // ESLINT
// gulp.task('eslint', function () {

//   return gulp.src(lintSrc)
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// });
// gulp.task('watch', function () {
//   gulp.watch(paths.scripts, ['scriptsDev']);
//   gulp.watch(paths.styles, ['stylesDev']);
// });
// // test TODO add test src
// gulp.task('test', ['jscs', 'eslint']);
// gulp.task('default', ['jscs', 'eslint', 'clean', 'scriptsDev', 'stylesDev', 'watch']);
// gulp.task('build', ['clean', 'scriptsProduction', 'stylesProduction', 'templatesProduction']);