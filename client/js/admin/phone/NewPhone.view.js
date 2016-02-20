'use strict';

var $        = require('jquery');
var _        = require('lodash');
var Backbone = require('backbone');
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance(),
    PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;

var Phone    = require('./Phone');
var template = require('./new-phone.jade');

var NewPhone = Backbone.View.extend({

  template: template,
  events: {
    'submit #create form': 'createPhone',
    'submit #confirm form': 'confirmPhone'
  },

  initialize: function(options){
    this.listenTo(this.collection, 'change', this.render);
  },

  render: function(){
    this.$el.html( this.template() );
    this.setElements();
    return this;
  },

  setElements: function(){
    this.$create    = this.$('#create');
    this.$telephone = this.$create.find('#telephone');
    this.$createEls = this.$create.find('#telephone, button');

    this.$confirm    = this.$('#confirm');
    this.$secretCode = this.$confirm.find('#secret_code');
    this.$confirmEls = this.$confirm.find('#secret_code, button');
  },

  createPhone: function(e){
    e.stopPropagation();
    e.preventDefault();

    var that = this;

    var telephone = $.trim(this.$telephone.val());
    var number = this._isValidAndReturnNumber(telephone);
    if (!number) {
      Materialize.toast('Formato de numero invalido.', 4000);
      return this.$createEls.prop('disabled', false);
    }

    this.$createEls.prop('disabled', true);

    var newPhone = new Phone({
      number: number
    });

    newPhone.save()
    .then(function(phone) {
      that.newPhone = phone;
      that.addToCollection(phone);

      that.showConfirm();
    })
    .fail(function() {
      Materialize.toast('No se pudo guardar, revisa el formato del numero.', 4000);
      that.$createEls.prop('disabled', true);
    });
  },

  confirmPhone: function(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.newPhone) {
      return this.closeConfirm();
    }

    var that = this;
    this.$confirmEls.prop('disabled', true);

    this.newPhone.confirm({
      secret_code: this.$secretCode.val()
    })
    .then(function(phone) {
      that.newPhone = phone;
      // update collection element

      Materialize.toast('Tu numero fue registrado y confirmado.', 4000);
      that.goToPhones();
    })
    .fail(function(err) {
      if (err.status === 404) {
        Materialize.toast('Codigo secreto invalido.', 4000);
        return that.$confirmEls.prop('disabled', false);
      }

      Materialize.toast('Hubo un error, intenta mas tarde.', 4000);
      that.goToPhones();
    });
  },

  _isValidAndReturnNumber: function(number) {
    try {
      var phone = phoneUtil.parse(number);

      if (phoneUtil.isValidNumber(phone)
          && phone.hasCountryCode()
          && phone.hasNationalNumber()) {

        return phoneUtil.format(phone, PhoneNumberFormat.E164);
      }

      return null;
    } catch(e) {
      return null;
    }
  },

  addToCollection: function(phone) {
    if (this.collection) {
      this.collection.add(phone);
    }
  },

  showConfirm: function() {
    this.$confirm.openModal();
    this.$secretCode.focus();
  },

  closeConfirm: function() {
    this.$confirm.closeModal();
  },

  goToPhones: function() {
    var that = this;
    setTimeout(function(){
      that.closeConfirm();
      location.href = '#phones';
    }, 3000);
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

module.exports = NewPhone;
