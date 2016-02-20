'use strict';

var $        = require('jquery');
var _        = require('lodash');
var Backbone = require('backbone');

var Phones       = require('./phone/Phones');
var PhonesView   = require('./phone/Phones.view');
var NewPhoneView = require('./phone/NewPhone.view');
// var EditPhoneView = require('./phone/EditPhone.view');

var App = Backbone.Router.extend({

  routes: {
    '':              'admin',
    'phone/new':     'newPhone',
    'phones':        'listPhones',
    'phone/:number': 'editPhone'
  },

  initialize: function(options) {
    this.$main  = options.$main;
    this.$admin = this.$main.find('.admin-app');
  },

  admin: function(){
    var that = this;
    this.phones = new Phones([]);

    this.phones.fetch()
    .then(function(phones) {
      if (phones && phones.length) {
        return that.navigate('phones', {trigger: true});
      }

      that.navigate('phone/new', {trigger: true});
    });
  },

  newPhone: function() {
    if (this.newPhoneView) {
      this.newPhoneView.destroy();
    }

    this._fetchPhones();

    this.newPhoneView = new NewPhoneView({el: this.$admin, collection: this.phones});
    this.newPhoneView.render();
  },

  listPhones: function(){
    if (this.PhonesView) {
      this.PhonesView.destroy();
    }

    this._fetchPhones();

    this.PhonesView = new PhonesView({el: this.$admin, collection: this.phones});
    this.PhonesView.render();
  },

  editPhone: function(number) {
    // if (this.EditPhoneView) {
    //   this.EditPhoneView.destroy();
    // }

    // this._fetchPhones();

    // this.EditPhoneView = new EditPhoneView({el: this.$admin, collection: this.phones,
    //   number: number});
    // this.EditPhoneView.render();
  },

  _fetchPhones: function() {
    if (!this.phones) {
      this.phones = new Phones([]);
      this.phones.fetch();
    }
  }

});

module.exports = App;
