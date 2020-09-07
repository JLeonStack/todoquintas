import { Component, OnInit, Input, OnDestroy } from '@angular/core';

// Importo el servicio de propiedades
import { PropiedadesService } from '../../../../services/propiedades.service';
import { UsuariosService } from '../../../../services/usuarios.service';

// Modelos
import { PropiedadModelGet } from '../../../../models/propiedad.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-propiedades',
  templateUrl: './tab-propiedades.component.html',
  styleUrls: ['./tab-propiedades.component.css'],
})
export class TabPropiedadesComponent implements OnInit, OnDestroy {
  propiedades: PropiedadModelGet[];

  propiedadSubscription: Subscription;
  usuarioSubscription: Subscription;

  constructor(
    private _propiedadesService: PropiedadesService,
    private _usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    console.log('Tab-propiedad-componente inicializado');

    // Ejecutaré el método getPropiedad() para obtener todas las propiedades que tenga el usuario logueado.
    this.propiedadSubscription = this._propiedadesService
      .getPropiedad()
      .subscribe((data) => {
        // Almaceno en la propiedad "propiedades" la información proveniente del servicio a firebase
        this.propiedades = data;
        this.usuarioSubscription = this._usuariosService
          .recuperarUserInformation(localStorage.getItem('_u_ky'))
          .subscribe((info_usuario) => {
            this.procesarDatos(info_usuario);
            this.usuarioSubscription.unsubscribe();
          });
        this.propiedadSubscription.unsubscribe();
      });
  }
  ngOnDestroy(): void {
    this.propiedadSubscription.unsubscribe();
    this.usuarioSubscription.unsubscribe();
  }

  procesarDatos(info_usuario) {
    // Recorro cada una de las propiedades provenientes del servicio para realizar una serie de operaciones:
    for (let item of this.propiedades) {
      // En primer lugar, obtendré el promedio de los precios introducidos:
      let precio_promedio = 0;
      let calificacion_promedio = 0;

      let cantidad_precios =
        item.propiedad.fechas_disponibles['precios'].length;

      let cantidad_calificaciones = item.calificacion.length;

      // for (let precio of item.propiedad.fechas_disponibles['precios']) {
      //   precio_promedio += precio;
      // }

      precio_promedio = item.propiedad.fechas_disponibles['precios'][0];

      for (let calificacion of item.calificacion) {
        calificacion_promedio += calificacion;
      }

      // Agrego una nueva propiedad al objeto devuelvo por el servicio denominado "precio_promedio"
      item.propiedad['precio_promedio'] = precio_promedio;

      // Agrego una nueva propiedad al item denominada calificacion promedio
      item['calificacion_promedio'] =
        calificacion_promedio / cantidad_calificaciones;

      item['user_picture'] = info_usuario[0].picture;
    }

    // console.log(this.propiedades);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
