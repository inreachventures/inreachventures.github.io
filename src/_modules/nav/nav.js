'use strict';

var $ = require('jquery');

var Nav = function() {
  this.scrollToTarget = function(anchor) {
    var position = $(anchor).offset().top;
    if ($('.sticky-nav').length) {
      position = position-100;
    }

    $('html,body').animate({scrollTop:position}, 'slow');
  }.bind(this);
};

module.exports = Nav;
