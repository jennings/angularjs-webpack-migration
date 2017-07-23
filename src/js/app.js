// Importing our dependencies here ensures they've loaded in the correct order.
// This is more visible than encoding this information in the gulpfile.
window.jQuery = require('jquery')
require('bootstrap/dist/js/bootstrap.min.js')
var angular = require('angular')

var myApp = angular.module('MyApp', [])

// By importing our components here, we can guarantee that the MyApp module is
// loaded before they run.
require('./components/app-title')
require('./components/app-body')

