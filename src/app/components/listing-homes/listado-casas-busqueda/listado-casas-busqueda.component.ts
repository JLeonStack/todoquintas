import { Component, OnInit } from '@angular/core';

// Servicios
import { LugaresSearchUbicacionService } from '../../../services/lugares-search-ubicacion.service';

// Modelo de datos:
import { PropiedadIndividualGetModel } from '../../../models/propiedad.model';

@Component({
  selector: 'app-listado-casas-busqueda',
  templateUrl: './listado-casas-busqueda.component.html',
  styleUrls: ['./listado-casas-busqueda.component.css'],
})
export class ListadoCasasBusquedaComponent implements OnInit {
  // propiedades: object[] = [{nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 9750, estado: 'disponible', calificacion: 5, imagen: 'assets/images/des/work-1.jpg'},
  // {nombre: 'Estancias del Pilar 2', ubicacion: 'Pilar, Buenos Aires', precio: 7700, estado: 'disponible', calificacion: 3, imagen: 'assets/images/des/work-2.jpg'}, {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 6500, estado: 'no disponible', calificacion: 4, imagen: 'assets/images/des/work-3.jpg'}, {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 4500, estado: 'disponible', calificacion: 4, imagen: 'assets/images/des/work-4.jpg'}, {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 4500, estado: 'disponible', calificacion: 5, imagen: 'assets/images/des/work-5.jpg'},
  // {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 3500, estado: 'no disponible', calificacion: 3, imagen: 'assets/images/des/work-7.jpg'}, {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 8500, estado: 'disponible', calificacion: 5, imagen: 'assets/images/des/work-8.jpg'}, {nombre: 'Estancias del Pilar', ubicacion: 'Pilar, Buenos Aires', precio: 14500, estado: 'disponible', calificacion: 4, imagen: 'assets/images/des/work-9.jpg'}];

  public propiedades: PropiedadIndividualGetModel[];

  constructor(
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService
  ) {}

  ngOnInit(): void {
    // Me subscribiré a una variable, la cual adquirirá los valores provenientes de la base de datos.
    this._lugaresSearchUbicacionService
      .getPropiedades()
      .subscribe((data: PropiedadIndividualGetModel[]) => {
        this.propiedades = data;
        // Proceso la información para poder mostrarla correctamente en pantalla.
        this.procesarDatos(this.propiedades);
        console.log(this.propiedades);
      });
  }
  // La siguiente función tendrá como tarea tomar cada una del las propiedades que tenga publicada el usuario, y se le agregará el precio base, y la calificación promedio.
  procesarDatos(propiedades: PropiedadIndividualGetModel[]) {
    if (propiedades) {
      // Recorro cada una de las propiedades provenientes del servicio para realizar una serie de operaciones:
      for (let propiedad of propiedades) {
        // En primer lugar, obtendré el promedio de los precios introducidos:
        let calificacion_promedio = 0;

        let cantidad_calificaciones = propiedad.calificacion.length;

        for (let calificacion of propiedad.calificacion) {
          calificacion_promedio += calificacion;
        }

        // Agrego una nueva propiedad al objeto devuelvo por el servicio denominado "precio_promedio"
        propiedad.propiedad['precio_base'] =
          propiedad.propiedad.fechas_disponibles['precios'][0];

        // Agrego una nueva propiedad al propiedad denominada calificacion promedio
        propiedad['calificacion_promedio'] =
          calificacion_promedio / cantidad_calificaciones;
      }
    }
  }
}
