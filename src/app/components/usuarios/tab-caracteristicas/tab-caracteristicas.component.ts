import { Component, OnInit } from '@angular/core';

// Esta importanción me permite poder captar los parámetros que envíe por url y procesarlos.
import { ActivatedRoute } from '@angular/router';

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

  public tab_index;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: { seccion: string }) => {
      // A continuación, en base a lo que desee veer el usuario, se seleccionará una tab en particular.
      if (params.seccion == 'favoritos') {
        this.tab_index = 0;
      } else if (params.seccion == 'propiedades') {
        this.tab_index = 1;
      } else if (params.seccion == 'publicar') {
        this.tab_index = 2;
      } else if (params.seccion == 'reservas') {
        this.tab_index = 3;
      } else if (params.seccion == 'datos') {
        this.tab_index = 4;
      }
    });
  }
}
