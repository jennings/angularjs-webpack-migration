var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var pump = require('pump')

var browserSync = require('browser-sync').create()

var input = {
  css: [
    'src/**/*.css',
  ],
  js: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/boostrap/dist/js/bootstrap.js',
    'node_modules/angular/angular.js',
    'src/**/*.js',
  ],
}

var output = {
  path: './dist/',
  js: 'js/bundle.js',
  css: 'css/bundle.css',
}

gulp.task('default', ['serve'])

gulp.task('build', function (done) {
  bundleJavaScript().then(done)
})

gulp.task('watch', ['build'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: ["./src", "./dist", "./node_modules"],
    port: 8000,
    middleware: [],
    reloadDelay: 0
  })

  gulp.watch(input.js, ['watch'])
})

function bundleJavaScript() {
  return new Promise(function (resolve) {
    pump(
      [
        gulp.src(input.js),
        concat(output.js),
        uglify(),
        gulp.dest(output.path),
      ],
      resolve
    )
  })
}
