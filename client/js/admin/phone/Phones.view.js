'use strict';

var $        = require('jquery');
var _        = require('lodash');
var Backbone = require('backbone');

var template = require('./phones-list.jade');

// TODO create endpoint instead of weird list
var receivers = [
  {number: '+56958566800'},
  {number: '+56996540467'}
];

var PhonesView = Backbone.View.extend({

  template: template,
  events: {

  },

  initialize: function(options){
    this.listenTo(this.collection, 'change', this.render);
  },

  render: function(){
    var phones = (this.collection && this.collection.length ?
      this.collection.toJSON() : []);

    this.$el.html( this.template({phones: phones, receivers: receivers}) );
    return this;
  },

  destroy: function() {
    // unbind events
    this.undelegateEvents();
    this.$el.removeData().unbind();
    // remove view from DOM
    // this.remove();
    // Backbone.View.prototype.remove.call(this);
  }

});

module.exports = PhonesView;
