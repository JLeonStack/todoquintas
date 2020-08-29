import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-p-carousell-main',
  templateUrl: './p-carousell-main.component.html',
  styleUrls: ['./p-carousell-main.component.css'],
})
export class PCarousellMainComponent implements OnInit, OnChanges {
  @Input() imagenes_propiedad;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
    if (this.imagenes_propiedad) {
      console.log(this.imagenes_propiedad['img_f']);
    }
  }
  ngOnInit(): void {
    var window_w = $(window).innerWidth();
    /*------------------
			Background set
		--------------------*/
    $('.set-bg').each(function () {
      var bg = $(this).data('setbg');
      $(this).css('background-image', 'url(' + bg + ')');
    });

    $('.gallery')
      .find('.gallery-item')
      .each(function () {
        var pi_height1 = $(this).outerWidth(true),
          pi_height2 = pi_height1 / 2;

        if ($(this).hasClass('grid-long') && window_w > 991) {
          $(this).css('height', pi_height2);
        } else {
          $(this).css('height', Math.abs(pi_height1));
        }
      });

    $('.gallery').masonry({
      itemSelector: '.gallery-item',
      columnWidth: '.grid-sizer',
      gutter: 20,
    });

    /*------------------
			Review Slider
		--------------------*/
    $('.review-slider').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      items: 1,
      dots: false,
      autoplay: true,
    });

    $('.clients-slider').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 30,
      nav: false,
      dots: false,
      responsive: {
        0: {
          items: 2,
          margin: 10,
        },
        600: {
          items: 3,
        },
        800: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
    });

    /*------------------
			Review Slider
		--------------------*/
  }
}
