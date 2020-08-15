import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-carousel-propiedad-detalles-list',
  templateUrl: './carousel-propiedad-detalles-list.component.html',
  styleUrls: ['./carousel-propiedad-detalles-list.component.css'],
})
export class CarouselPropiedadDetallesListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Carousel estinado a mostrar las características de las propiedades en la versión móvil
    $('.owl-carousel.seccion-propiedades').owlCarousel({
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
