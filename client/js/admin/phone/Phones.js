'use strict';

var $        = require('jquery');
var _        = require('lodash');
var Backbone = require('backbone');

var Phone    = require('./Phone');

var Phones = Backbone.Collection.extend({

  model: Phone,

  initialize: function() {

  },

  fetch: function() {
    var that = this;

    return $.ajax({
      url:    '/phones',
      method: 'GET'
    }).then(function(data) {
      that.set(data.phones);
      that.trigger('change', that);

      return that;
    });
  }

});

module.exports = Phones;
