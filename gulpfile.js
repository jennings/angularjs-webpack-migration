var gulp = require('gulp')
var streamqueue = require('streamqueue')
var sourcemaps = require('gulp-sourcemaps')
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
    // The order the files are included is important, e.g., app.js needs
    // to create our AngularJS module before the components add to it.
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

gulp.task('js', function (done) {

  // Using streamqueue so we are sure to include app.js to create the
  // AngularJS module before we add to its template cache.
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

gulp.task('build', ['js', 'css'])

gulp.task('js-reload', ['js'], function () {
  browserSync.reload()
})

gulp.task('watch', ['build'], function () {
  browserSync.reload()
})

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
  gulp.watch(input.js.concat(input.templates), ['js-reload'])
  gulp.watch(input.scss, ['css'])
  gulp.watch(output.html_watch).on('change', browserSync.reload)
})
