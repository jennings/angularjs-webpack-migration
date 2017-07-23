var gulp = require('gulp')
var streamqueue = require('streamqueue')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var pump = require('pump')
var sass = require('gulp-sass')
var angularTemplatecache = require('gulp-angular-templatecache')

var browserSync = require('browser-sync').create()

var input = {
  scss: [
    'node_modules/boostrap/dist/css/bootstrap.min.css',
    'src/**/*.scss',
  ],
  js: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/boostrap/dist/js/bootstrap.js',
    'node_modules/angular/angular.js',
    'src/app.js',
    'src/**/*.js',
  ],
  templates: [
    'src/js/components/**/*.html'
  ],
  html: [
    'src/index.html'
  ],
}

var output = {
  path: './dist/',
  js: 'js/bundle.js',
  scss: 'css/bundle.scss',
  css: 'css/bundle.css',
  html_watch: [
    'dist/**/*.html'
  ],
}

gulp.task('default', ['serve'])

var sourcemaps = require('gulp-sourcemaps')

gulp.task('js', function (done) {
  var scripts = streamqueue({ objectMode: true })
  scripts.queue(gulp.src(input.js))
  scripts.queue(getTemplateStream())

  pump(
    [
      scripts.done(),
      sourcemaps.init(),
      concat(output.js),
      uglify(),
      sourcemaps.write('./'),
      gulp.dest(output.path),
    ],
    done
  )
})

function getTemplateStream() {
  return gulp.src(input.templates)
    .pipe(angularTemplatecache('templates.js', {
      module: 'MyApp',
      standalone: false,
      root: '/js/components'
    }))
}

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

gulp.task('html', function () {
  gulp.src(input.html)
    .pipe(gulp.dest(output.path))
})

gulp.task('build', ['js', 'css', 'html'])

gulp.task('js-reload', ['js'], function () {
  browserSync.reload()
})

gulp.task('watch', ['build'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: ["./dist"],
    port: 8000,
    middleware: [],
    reloadDelay: 0
  })

  gulp.watch(input.js.concat(input.templates), ['js-reload'])
  gulp.watch(input.scss, ['css'])
  gulp.watch(input.html, ['html'])
  gulp.watch(output.html_watch).on('change', browserSync.reload)
})
