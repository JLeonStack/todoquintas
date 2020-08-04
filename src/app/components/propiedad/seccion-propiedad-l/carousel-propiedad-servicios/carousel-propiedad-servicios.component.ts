import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-carousel-propiedad-servicios',
  templateUrl: './carousel-propiedad-servicios.component.html',
  styleUrls: ['./carousel-propiedad-servicios.component.css'],
})
export class CarouselPropiedadServiciosComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Carousel estinado a mostrar los servicios de las propiedades
    $('.owl-carousel.seccion-servicios').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 3,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
    });
  }
}
