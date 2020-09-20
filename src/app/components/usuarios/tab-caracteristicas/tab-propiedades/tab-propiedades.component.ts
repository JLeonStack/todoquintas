import { Component, OnInit, OnDestroy } from '@angular/core';

// Importo el servicio de propiedades
import { PropiedadesService } from '../../../../services/propiedades.service';

// Modelos
import { PropiedadModelGet } from '../../../../models/propiedad.model';

// Importo AuthService
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

// Importo modelo de datos
import { usuarioModel } from '../../../../models/usuario.model';

// Rutas
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-propiedades',
  templateUrl: './tab-propiedades.component.html',
  styleUrls: ['./tab-propiedades.component.css'],
})
export class TabPropiedadesComponent implements OnInit, OnDestroy {
  // La siguiente propiedad el componente almacenará las propiedades provenientes de la base de datos.
  /* Es un array de propiedades */
  public propiedades: PropiedadModelGet[];

  // La siguiente es la subscripción de Auth0.
  private auth0Subscription: Subscription;

  constructor(
    private _propiedadesService: PropiedadesService,
    private auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Almaceno el id del usuario logueado.
    let userAuth0 = localStorage.getItem('_u_ky');

    if (userAuth0) {
      // A continuación, llamo a la funcion getPropiedad del servicios propidades para obtener todas las propiedades que tenga el usuario logueado publicadas.
      this._propiedadesService
        .getPropiedad(userAuth0)
        .then((data: PropiedadModelGet[]) => {
          console.log(data);
          // Asigno a la propiedad data, la información proveniente de firebase
          this.propiedades = data;

          // Proceso la información para poder mostrarla correctamente en pantalla.
          this.procesarDatos(this.propiedades);
        });
    } else {
      this.auth0Subscription = this.auth.userProfile$.subscribe(
        (usuarioAuth: usuarioModel) => {
          // Realizo una pequeña validación, asegurándome que obtengo los datos provenientes de auth0.
          if (usuarioAuth) {
            // Obtengo el id auth0;
            let obtener_id_auth = usuarioAuth.sub.split('|');
            let id_auth = obtener_id_auth[1];
            // A continuación, llamo a la funcion getPropiedad del servicios propidades para obtener todas las propiedades que tenga el usuario logueado publicadas.
            this._propiedadesService
              .getPropiedad(id_auth)
              .then((data: PropiedadModelGet[]) => {
                console.log(data);
                // Asigno a la propiedad data, la información proveniente de firebase
                this.propiedades = data;

                // Proceso la información para poder mostrarla correctamente en pantalla.
                this.procesarDatos(this.propiedades);
              });
          }
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.auth0Subscription) {
      this.auth0Subscription.unsubscribe();
    }
  }

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

  editarPropiedad(id_prop) {
    this._router.navigate(['/usuario/propiedades']);
    setTimeout(() => {
      this._router.navigate(['/usuario/publicar'], {
        queryParams: {
          edit: true,
          propiedad_id: id_prop,
        },
      });
    }, 100);
    console.log(id_prop);
  }
}
