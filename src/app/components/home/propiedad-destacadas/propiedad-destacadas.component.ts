import { Component, OnInit } from '@angular/core';
declare var $: any;

export interface Propiedad {
  nombre: string;
  ubicacion: string;
  precio: number;
  estado: string;
  calificacion: number;
  imagen: string;
}

@Component({
  selector: 'app-propiedad-destacadas',
  templateUrl: './propiedad-destacadas.component.html',
  styleUrls: ['./propiedad-destacadas.component.css'],
})
export class PropiedadDestacadasComponent implements OnInit {
  propiedades: Propiedad[] = [
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 9750,
      estado: 'disponible',
      calificacion: 5,
      imagen: 'assets/images/des/work-1.jpg',
    },
    {
      nombre: 'Estancias del Pilar 2',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 7700,
      estado: 'disponible',
      calificacion: 3,
      imagen: 'assets/images/des/work-2.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 6500,
      estado: 'no disponible',
      calificacion: 4,
      imagen: 'assets/images/des/work-3.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 4500,
      estado: 'disponible',
      calificacion: 4,
      imagen: 'assets/images/des/work-4.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 4500,
      estado: 'disponible',
      calificacion: 5,
      imagen: 'assets/images/des/work-5.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 3500,
      estado: 'no disponible',
      calificacion: 3,
      imagen: 'assets/images/des/work-7.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 8500,
      estado: 'disponible',
      calificacion: 5,
      imagen: 'assets/images/des/work-8.jpg',
    },
    {
      nombre: 'Estancias del Pilar',
      ubicacion: 'Pilar, Buenos Aires',
      precio: 14500,
      estado: 'disponible',
      calificacion: 4,
      imagen: 'assets/images/des/work-9.jpg',
    },
  ];

  constructor() {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.carousel-properties').owlCarousel({
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
    });
  }
}
