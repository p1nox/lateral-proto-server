'use strict';

var $        = require('jquery');
var _        = require('lodash');
var Backbone = require('backbone');

var Phone = Backbone.Model.extend({

  initialize: function() {

  },

  save: function() {
    var that = this;
    var data = {
      number: this.get('number')
    };

    return $.ajax({
      url:    '/phone',
      data:    data,
      method: 'POST'
    })
    .then(function(res) {
      that.set(res.phone);

      return that;
    });
  },

  confirm: function(args) {
    var that = this;
    var data = {
      number: this.get('number'),
      secret_code: args.secret_code
    };

    return $.ajax({
      url:    '/phone/confirm',
      data:    data,
      method: 'POST'
    })
    .then(function(res) {
      that.set(res.phone);

      return that;
    });
  }

});

module.exports = Phone;
