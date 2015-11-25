'use strict';

var $ = window.jQuery = require('jquery'),
    tooltip = require('bootstrap-tooltip'),
    bootstrap = require('bootstrap-sass'),
    Nav = require('../_modules/nav/nav.js'),
    nav = new Nav();

function getHeroBodyHeight() {
  var padding = parseInt($('.hero-nav').css('padding-top'))*2;
  return $('.hero-nav').outerHeight()+padding+$('.vc-content').outerHeight()+50;
}

function getHeroHeight() {
  var height = $(window).height();
  return height < getHeroBodyHeight() ? heroBodyHeight + 100 : height;
}

// Check hero height
function checkHero() {
  if($('#hero-bloc').length) {
    $('.hero').css('height', getHeroHeight() + 'px');
  }
}

function hideAll() {
  $('.animated').each(function(i) {
    if(!$(this).closest('.hero').length) {
      $(this).removeClass('animated').addClass('hideMe');
    }
  });
}

function inViewCheck() {
  $($(".hideMe").get().reverse()).each(function(i) {
    var target = jQuery(this);
    var a = target.offset().top + target.height();
    var b = $(window).scrollTop() + $(window).height();

    if(target.height() > $(window).height()) {
      a = target.offset().top;
    }

    if (a < b) {
      var objectClass = target.attr('class').replace('hideMe' , 'animated');
      target.css('visibility','hidden').removeAttr('class');
      setTimeout(function(){
        target.attr('class',objectClass).css('visibility','visible');
      },0.01);
    }
  });
}

function scrollToTopView() {
  if($(window).scrollTop() > $(window).height()/3) {
    if(!$('.scrollToTop').hasClass('showScrollTop')) {
      $('.scrollToTop').addClass('showScrollTop');
    }
  } else {
    $('.scrollToTop').removeClass('showScrollTop');
  }
}

function setUpLightBox() {
  $(document).on('click', '[data-lightbox]', function(e) {
    e.preventDefault();
    var targetLightbox = $(this);
    var captionData ='<p class="lightbox-caption">'+$(this).attr('data-caption')+'</p>';
    if(!$(this).attr('data-caption')) {
      captionData = '';
    }

    var customModal = $('<div id="lightbox-modal" class="modal fade"><div class="modal-dialog"><div class="modal-content '+$(this).attr('data-frame')+'"><button type="button" class="close close-lightbox" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="modal-body"><a href="#" class="prev-lightbox" aria-label="prev"></a><a href="#" class="next-lightbox" aria-label="next"></a><img id="lightbox-image" class="img-responsive" src="'+$(this).attr('data-lightbox')+'">'+captionData+'</div></div></div></div>');
    $('body').append(customModal);
    $('#lightbox-modal').modal('show');

    // Handle navigation buttons (next - prev)
    if($('a[data-lightbox]').index(targetLightbox) == 0) {
      $('.prev-lightbox').hide();
    }
    if($('a[data-lightbox]').index(targetLightbox) == $('a[data-lightbox]').length-1) {
      $('.next-lightbox').hide();
    }
  }
  ).on('hidden.bs.modal', '#lightbox-modal', function() {
    $('#lightbox-modal').remove();
  })

  $(document).on('click', '.next-lightbox, .prev-lightbox', function(e) {
    e.preventDefault();
    var idx = $('a[data-lightbox]').index(targetLightbox);
    var next = $('a[data-lightbox]').eq(idx+1);

    if($(this).hasClass('prev-lightbox')) {
      next = $('a[data-lightbox]').eq(idx-1);
    }
    $('#lightbox-image').attr('src',next.attr('data-lightbox'));
    $('.lightbox-caption').html(next.attr('data-caption'));
    targetLightbox = next;

    // Handle navigation buttons (next - prev)
    $('.next-lightbox, .prev-lightbox').hide();

    if($('a[data-lightbox]').index(next) != $('a[data-lightbox]').length-1) {
      $('.next-lightbox').show();
    }
    if($('a[data-lightbox]').index(next) > 0) {
      $('.prev-lightbox').show();
    }
  });
}

function animateWhenVisible() {
  hideAll();
  inViewCheck();

  $(window).scroll(function() {
    inViewCheck();
    scrollToTopView();
    stickyNavToggle();
  });
}

function stickyNavToggle() {
  var offset = 0;
  var clazz = "sticky";

  if($('.sticky-nav').parent().is('#hero-bloc')) {
    offset = $('.sticky-nav').height();
    clazz = "sticky animated fadeInDown";
  }

  if($(window).scrollTop() > offset) {
    $('.sticky-nav').addClass(clazz);

    if(clazz == "sticky") {
      $('.page-container').css('padding-top',$('.sticky-nav').height());
    }
  } else {
    $('.sticky-nav').removeClass(clazz);
    $('.page-container').removeAttr('style');
  }
}

$(function() {
  $('body').on('touchstart', function(e){
    if ($('body').hasClass('noscroll')) {
      e.preventDefault();
    }
  });

  $(".icon").click(function () {
    $(".mobilenav").fadeToggle(500);
    $(".top-menu").toggleClass("top-animate");
    $("body").toggleClass("noscroll");
    $(".mid-menu").toggleClass("mid-animate");
    $(".bottom-menu").toggleClass("bottom-animate");
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $(".mobilenav").fadeOut(500);
      $(".top-menu").removeClass("top-animate");
      $("body").removeClass("noscroll");
      $(".mid-menu").removeClass("mid-animate");
      $(".bottom-menu").removeClass("bottom-animate");
    }
  });

  checkHero();
  animateWhenVisible();

  $('.hero').css('height', $(window).height()+'px');
  $('#scroll-hero').click(function() {
    $('html,body').animate({scrollTop: $("#hero-bloc").height()}, 'slow');
  });

  setUpLightBox();

  $(window).resize(function() {
    $('.hero').css('height',getHeroHeight()+'px'); // Refresh hero height
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('.scroll-to').click(function(e) {
    e.preventDefault();
    nav.scrollToTarget(e.target.dataset.target);
  });
});
