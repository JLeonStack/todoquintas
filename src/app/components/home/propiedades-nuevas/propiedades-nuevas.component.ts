import { Component, OnInit } from '@angular/core';

// Servicios
import { PropiedadesHomeService } from '../../../services/propiedades-home.service';
import { PropiedadIndividualGetModel } from '../../../models/propiedad.model';

@Component({
  selector: 'app-propiedades-nuevas',
  templateUrl: './propiedades-nuevas.component.html',
  styleUrls: ['./propiedades-nuevas.component.css'],
})
export class PropiedadesNuevasComponent implements OnInit {
  propiedades: PropiedadIndividualGetModel[];

  buenos_aires: PropiedadIndividualGetModel[];
  cordoba: PropiedadIndividualGetModel[];
  rio_negro: PropiedadIndividualGetModel[];
  neuquen: PropiedadIndividualGetModel[];
  corrientes: PropiedadIndividualGetModel[];

  constructor(private _propiedadesHomeService: PropiedadesHomeService) {}

  ngOnInit(): void {
    this._propiedadesHomeService
      .getPropiedades()
      .then((data: PropiedadIndividualGetModel[]) => {
        this.propiedades = data;
        // console.log(this.propiedades);
        this.procesarDatos(this.propiedades);

        this.buenos_aires = this.propiedades
          .filter((item) => item.propiedad.provincia == 'Buenos Aires')
          .slice(0, 6);

        this.cordoba = this.propiedades
          .filter((item) => item.propiedad.provincia == 'Córdoba')
          .slice(0, 6);
        this.rio_negro = this.propiedades
          .filter((item) => item.propiedad.provincia == 'Río Negro')
          .slice(0, 6);
        this.neuquen = this.propiedades
          .filter((item) => item.propiedad.provincia == 'Neuquén')
          .slice(0, 6);
        this.corrientes = this.propiedades
          .filter((item) => item.propiedad.provincia == 'Corrientes')
          .slice(0, 6);
        console.log(this.buenos_aires);
      });
    // Activo el carousel
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
