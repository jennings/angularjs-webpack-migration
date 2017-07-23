var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var pump = require('pump')
var sass = require('gulp-sass')

var browserSync = require('browser-sync').create()

var input = {
  scss: [
    'src/**/*.scss',
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
  scss: 'css/bundle.scss',
  css: 'css/bundle.css',
}

gulp.task('default', ['serve'])

gulp.task('js', function (done) {
  pump(
    [
      gulp.src(input.js),
      concat(output.js),
      uglify(),
      gulp.dest(output.path),
    ],
    done
  )
})
gulp.task('css', function (done) {
  pump(
    [
      gulp.src(input.scss),
      sass(),
      concat(output.css),
      gulp.dest(output.path),
      browserSync.stream(),
    ],
    done
  )
})

gulp.task('build', ['js', 'css'])

gulp.task('js-reload', ['js'], function () {
  browserSync.reload()
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

  gulp.watch(input.js, ['js-reload'])
  gulp.watch(input.scss, ['css'])
})
