import { Component, OnInit, OnDestroy } from '@angular/core';

// Importo el servicio de propiedades
import { PropiedadesService } from '../../../../services/propiedades.service';

// Modelos
import { PropiedadModelGet } from '../../../../models/propiedad.model';

@Component({
  selector: 'app-tab-propiedades',
  templateUrl: './tab-propiedades.component.html',
  styleUrls: ['./tab-propiedades.component.css'],
})
export class TabPropiedadesComponent implements OnInit, OnDestroy {
  // La siguiente propiedad el componente almacenará las propiedades provenientes de la base de datos.
  /* Es un array de propiedades */
  public propiedades: PropiedadModelGet[];

  constructor(private _propiedadesService: PropiedadesService) {}

  ngOnInit(): void {
    // Almaceno el id del usuario logueado.
    let userAuth0 = localStorage.getItem('_u_ky');

    // A continuación, llamo a la funcion getPropiedad del servicios propidades para obtener todas las propiedades que tenga el usuario logueado publicadas.
    this._propiedadesService
      .getPropiedad(userAuth0)
      .then((data: PropiedadModelGet[]) => {
        // Asigno a la propiedad data, la información proveniente de firebase
        this.propiedades = data;

        // Proceso la información para poder mostrarla correctamente en pantalla.
        this.procesarDatos(this.propiedades);
      });
  }
  ngOnDestroy(): void {}

  // La siguiente función tendrá como tarea tomar cada una del las propiedades que tenga publicada el usuario, y se le agregará el precio base, y la calificación promedio.
  procesarDatos(propiedades: PropiedadModelGet[]) {
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

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
