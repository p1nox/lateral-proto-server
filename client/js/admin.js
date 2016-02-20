'use strict';

var $ = require('jquery');
require('materialize');
var Backbone = require('backbone');
Backbone.$   = $; // browserify workaround (http://stackoverflow.com/questions/21180242/browserify-separate-libs-js-and-app-js-causes-backbone-to-not-find-jquery)

var App = require('./admin/app');

$(function() {

  $(".button-collapse").sideNav();

  new App({$main: $('main')});
  Backbone.history.start({root: '/admin/'});

});
