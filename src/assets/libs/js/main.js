// A $( document ).ready() block.
$(document).ready(function () {
  (function ($) {
    "use strict";

    $(window).stellar({
      responsive: true,
      parallaxBackgrounds: true,
      parallaxElements: true,
      horizontalScrolling: false,
      hideDistantElements: false,
      scrollProperty: "scroll",
    });

    var fullHeight = function () {
      $(".js-fullheight").css("height", $(window).height());
      $(window).resize(function () {
        $(".js-fullheight").css("height", $(window).height());
      });
    };
    fullHeight();

    // loader
    var loader = function () {
      setTimeout(function () {
        if ($("#ftco-loader").length > 0) {
          $("#ftco-loader").removeClass("show");
        }
      }, 1);
    };
    loader();

    // Scrollax
    $.Scrollax();

    var carousel = function () {
      $(".carousel-testimony").owlCarousel({
        center: true,
        loop: true,
        items: 1,
        margin: 30,
        stagePadding: 0,
        nav: false,
        navText: [
          '<span class="ion-ios-arrow-back">',
          '<span class="ion-ios-arrow-forward">',
        ],
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 2,
          },
          1000: {
            items: 3,
          },
        },
      });
    };
    carousel();

    $("nav .dropdown").hover(
      function () {
        var $this = $(this);
        // 	 timer;
        // clearTimeout(timer);
        $this.addClass("show");
        $this.find("> a").attr("aria-expanded", true);
        // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
        $this.find(".dropdown-menu").addClass("show");
      },
      function () {
        var $this = $(this);
        // timer;
        // timer = setTimeout(function(){
        $this.removeClass("show");
        $this.find("> a").attr("aria-expanded", false);
        // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
        $this.find(".dropdown-menu").removeClass("show");
        // }, 100);
      }
    );

    $("#dropdown04").on("show.bs.dropdown", function () {
      console.log("show");
    });

    // scroll
    var scrollWindow = function () {
      $(window).scroll(function () {
        var $w = $(this),
          st = $w.scrollTop(),
          navbar = $(".ftco_navbar"),
          sd = $(".js-scroll-wrap");

        if (st > 150) {
          if (!navbar.hasClass("scrolled")) {
            navbar.addClass("scrolled");
          }
        }
        if (st < 150) {
          if (navbar.hasClass("scrolled")) {
            navbar.removeClass("scrolled sleep");
          }
        }
        if (st > 350) {
          if (!navbar.hasClass("awake")) {
            navbar.addClass("awake");
          }

          if (sd.length > 0) {
            sd.addClass("sleep");
          }
        }
        if (st < 350) {
          if (navbar.hasClass("awake")) {
            navbar.removeClass("awake");
            navbar.addClass("sleep");
          }
          if (sd.length > 0) {
            sd.removeClass("sleep");
          }
        }
      });
    };
    scrollWindow();

    // magnific popup
    $(".image-popup").magnificPopup({
      type: "image",
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: "mfp-no-margins mfp-with-zoom", // class to remove default margin from left and right side
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        verticalFit: true,
      },
      zoom: {
        enabled: true,
        duration: 300, // don't foget to change the duration also in CSS
      },
    });

    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (scroll < 100) {
        $(".fixed-top").css("background", "transparent");
      } else {
        $(".fixed-top").css("background", "#00a699");
        $(".fixed-top").css("transition", "0.51s");
      }
    });

    // Diseño dos
  })(jQuery);
});
