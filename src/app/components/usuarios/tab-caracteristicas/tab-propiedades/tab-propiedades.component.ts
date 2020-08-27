import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-propiedades',
  templateUrl: './tab-propiedades.component.html',
  styleUrls: ['./tab-propiedades.component.css'],
})
export class TabPropiedadesComponent implements OnInit {
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
  ];

  constructor() {}

  ngOnInit(): void {}
  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
