// Importing our dependencies here ensures they've loaded in the correct order.
// This is more visible than encoding this information in the gulpfile.
window.jQuery = require('jquery')
require('bootstrap/dist/js/bootstrap.min.js')
var angular = require('angular')

  // This gives us a way to declare the Sass files as part of the bundle.
  // webpack takes care of figuring out _how_ to include it.
require('../css/app.scss')

var myApp = angular.module('MyApp', [])

// By importing our components here, we can guarantee that the MyApp module is
// loaded before they run.
require('./components/app-title')
require('./components/app-body')

