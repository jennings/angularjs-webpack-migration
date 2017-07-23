var gulp = require('gulp')
var streamqueue = require('streamqueue')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var pump = require('pump')
var sass = require('gulp-sass')
var angularTemplatecache = require('gulp-angular-templatecache')
var webpackStream = require('webpack-stream')
var webpackConfig = require('./webpack.config.js')

var browserSync = require('browser-sync').create()

var input = {
  scss: [
    'node_modules/boostrap/dist/css/bootstrap.min.css',
    'src/**/*.scss',
  ],
  js: [
    // The order no longer matters, since webpack bundles in the correct order.
    // However, we need to list the files to watch so Browsersync knows when to
    // reload.
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
  js: "js/bundle.js",
  scss: 'css/bundle.scss',
  css: 'css/bundle.css',
}

gulp.task('default', ['serve'])

gulp.task('js', function () {

  // Using streamqueue so we are sure to include app.js to create the
  // AngularJS module before we add to its template cache.
  var scripts = streamqueue({ objectMode: true })

  // We're using webpack to bundle the JavaScript files rather than manually
  // concatenating and uglifying them. webpack automatically runs uglify during
  // production builds.
  scripts.queue(gulp.src(webpackConfig.entry)
    .pipe(webpackStream(webpackConfig)))

  // Templates are not yet part of the webpack bundle, so we still have to
  // concat them manually
  scripts.queue(getTemplateStream())

  return scripts.done()
    .pipe(concat(output.js))
    .pipe(gulp.dest(output.path))
})

function getTemplateStream() {
  return gulp.src(input.templates)
    .pipe(angularTemplatecache('js/templates.js', {
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
  return gulp.src(input.html)
    .pipe(gulp.dest(output.path))
})

gulp.task('build', ['js', 'css', 'html'])

gulp.task('serve', ['build'], function () {
  // Browsersync serves whatever is built into the output
  browserSync.init({
    server: ["./dist"],
    port: 8000,
    middleware: [],
    reloadDelay: 0
  })

  // We have to carefully set up the detection of changed files, so we
  // can automatically reload the page with Browsersync
  gulp.watch(
    input.js.concat(input.templates),
    ['js'])
    .on('change', browserSync.reload)
  gulp.watch(input.scss, ['css'])
  gulp.watch(input.html, ['html']).on('change', browserSync.reload)
})
