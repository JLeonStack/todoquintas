import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-caracteristicas',
  templateUrl: './tab-caracteristicas.component.html',
  styleUrls: ['./tab-caracteristicas.component.css'],
})
export class TabCaracteristicasComponent implements OnInit {
  propiedades: object[] = [
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

  ngOnInit(): void {}
}
