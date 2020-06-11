
/*var pageHeader = document.querySelector('.page-header');
var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.page-header__toggle');

pageHeader.classList.remove('page-header--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    navToggle.classList.remove('page-header__toggle--closed');
    navToggle.classList.add('page-header__toggle--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    navToggle.classList.remove('page-header__toggle--opened');
    navToggle.classList.add('page-header__toggle--closed');
  }
});*/

$('.product-card__btn').on('click', function(e) {
  e.preventDefault();
  var productCard = $(this).parent().parent().parent('.product-card');
  var productTitle = productCard.find('.product-card__title').text();
  var imgProduct = productCard.find('.product-card__photo img').attr('src');
  var modalTitle = $('.modal__title span');

  modalTitle.text(productTitle);

  $.fancybox.open({
    src  : '#modal-form',
    type : 'inline',
    opts : {
      afterShow : function( instance, current ) {
        //console.log( 'done!' + productCard);
      }
    }
  });
});
