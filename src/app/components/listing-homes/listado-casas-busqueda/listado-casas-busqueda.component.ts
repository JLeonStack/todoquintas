import { Component, OnInit, OnDestroy } from '@angular/core';

// Servicios
import { LugaresSearchUbicacionService } from '../../../services/lugares-search-ubicacion.service';

// Modelo de datos:
import { PropiedadIndividualGetModel } from '../../../models/propiedad.model';
import { Busqueda } from '../../../models/busqueda.model';

// Rutas
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado-casas-busqueda',
  templateUrl: './listado-casas-busqueda.component.html',
  styleUrls: ['./listado-casas-busqueda.component.css'],
})
export class ListadoCasasBusquedaComponent implements OnInit, OnDestroy {
  public propiedades: PropiedadIndividualGetModel[];
  public aux_pro: PropiedadIndividualGetModel[];
  public aux_pro_filtro: PropiedadIndividualGetModel[];

  public no_search_prop = false;

  public loading = true;

  public busqueda: Busqueda;

  public getPropiedadSubscribe: Subscription;

  public inicio = 0;
  public final = 3;
  public size_query = 3;

  public inicio_filtro = 0;
  public final_filtro = 3;

  constructor(
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inicio = 0;
    this.final = 3;
    this.inicio_filtro = 0;
    this.final_filtro = 3;

    // A continuación me subscribo a los parámetros que se envién por url.
    this.route.queryParamMap.subscribe((params: any) => {
      /* Restablezco en cero cada uno de los índices que controlarán las propiedades que se mostrarán */
      this.inicio = 0;
      this.final = 3;
      this.inicio_filtro = 0;
      this.final_filtro = 3;
      /* Restablezco en cero cada uno de los índices que controlarán las propiedades que se mostrarán */

      // A continuación setearé las propiedades que vengan de firebase (A través de la subscripción a la variable)
      this.propiedades = this.aux_pro;

      // Utilizaré una variable auxiliar que también adquirirá el valor de la propiedad auxiliar.
      this.aux_pro_filtro = this.aux_pro;

      // Almaceno los parámetros en la propiedad búsqueda
      this.busqueda = { ...params.params };

      // Procedo a filtrar la búsqueda según los parámetros establecidos por el usuario
      if (this.busqueda.filtro == 'true' && this.aux_pro_filtro != null) {
        for (const param in this.busqueda) {
          if (param == 'propiedad') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => item.propiedad.tipo_propiedad == this.busqueda.propiedad
            );
          }
          if (param == 'banos') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => item.propiedad.banos >= parseInt(this.busqueda.banos)
            );
          }
          if (param == 'dormitorios') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) =>
                item.propiedad.dormitorios >=
                parseInt(this.busqueda.dormitorios)
            );
          }
          if (param == 'huespedes') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) =>
                item.propiedad.capacidad_alojamiento >=
                parseInt(this.busqueda.huespedes)
            );
          }

          /* Filtros principales */

          if (param == 'internet') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.internet == 'true') {
                  return item.propiedad.internet == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'piscina') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.piscina == 'true') {
                  return item.propiedad.piscina == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'seguridad') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.seguridad == 'true') {
                  return item.propiedad.seguridad == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'tv') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.tv == 'true') {
                  return item.propiedad.tv == true;
                } else {
                  return item;
                }
              }
            );
          }

          /* Filtros principales */

          /* Filtros secundarios */

          if (param == 'mascotas') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.mascotas == 'true') {
                  return item.propiedad.mascotas == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'solo_familia') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.solo_familia == 'true') {
                  return item.propiedad.solo_familia == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'serv_limpieza') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.serv_limpieza == 'true') {
                  return item.propiedad.serv_limpieza == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'parilla') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.parilla == 'true') {
                  return item.propiedad.parilla == true;
                } else {
                  return item;
                }
              }
            );
          }
          if (param == 'aire_acondicionado') {
            this.aux_pro_filtro = Object.values(this.aux_pro_filtro).filter(
              (item) => {
                if (this.busqueda.aire_acondicionado == 'true') {
                  return item.propiedad.aire_acondicionado == true;
                } else {
                  return item;
                }
              }
            );
          }
          // console.log(param);
        }

        // console.log(resultado);
        if (this.propiedades.length == 0) {
          this.no_search_prop = true;
          this.loading = false;
        } else {
          this.loading = false;
          this.no_search_prop = false;
        }
      }

      // A continuación, si se recibe una búsqueda por filtro, procederé a mostrar solamente aquellas propiedades que cumplen con estos parámetros, y solamente desplegar las propiedades del 0,3, 6,9,9,12 a medida que se hace scrholl
      if (this.busqueda.filtro == 'true' && this.aux_pro_filtro != null) {
        // En una variable temporal almaceno las propiedades filtradas del 0 al 3.
        let array_prop = this.aux_pro_filtro.slice(
          this.inicio_filtro,
          this.final_filtro
        );

        // Almaceno esa variable temporal en la propiedad "propiedades" que se encargará de desplegar dichas viviendas
        this.propiedades = array_prop;

        // El valor inicial del slice pasará a ser el valor final, y el final se incrementará por 3.
        this.inicio_filtro = this.final_filtro;
        this.final_filtro += this.size_query;
      }

      if (this.busqueda.filtro == 'true' && this.aux_pro_filtro != null) {
        // A continuación, en caso de que no se encuentre ninguna propiedad mostraré en pantalla un mensaje indicando que no se han encontrado propiedades.
        if (this.propiedades.length == 0 || this.propiedades == null) {
          this.no_search_prop = true;
          this.loading = false;
        } else {
          this.loading = false;
          this.no_search_prop = false;
        }
      }
    });
    // Me subscribiré a una variable, la cual adquirirá los valores provenientes de la base de datos.
    this.getPropiedadSubscribe = this._lugaresSearchUbicacionService
      .getPropiedades()
      .subscribe((data: PropiedadIndividualGetModel[]) => {
        // A continuación almacenaré la información proveniente de la variable que almacenará la información de firebase en una variable auxiliar
        this.aux_pro = data;

        // Si el tamaño de la variable auxiliar es mayor a cero, y a su vez, no se ha decidido filtrar los resultados, procederé a mostrar solamente las propiedades el 0,3. 3,6 ..
        if (this.aux_pro.length > 0 && this.busqueda.filtro != 'true') {
          // for (let i = 0; i < 2; i++) {
          //   this.aux_pro.push(...this.aux_pro);
          // }
          // console.log(this.aux_pro);

          // A continuación, almaceno en una variable temporal las propiedades del 0 al 3
          let array_prop = this.aux_pro.slice(this.inicio, this.final);

          // Asigno en la variable propiedades, las viviendas del 0,3
          this.propiedades = array_prop;

          // Establezco la variable inicio con el valor de la variable final, e incremento esta última en 3.
          this.inicio = this.final;
          this.final += this.size_query;
        }

        // Proceso la información para poder mostrarla correctamente en pantalla.
        this.procesarDatos(this.propiedades);

        // A continuación, en caso de que no se encuentre ninguna propiedad mostraré en pantalla un mensaje indicando que no se han encontrado propiedades.
        if (this.aux_pro.length == 0) {
          this.no_search_prop = true;
          this.loading = false;
        } else {
          this.loading = false;
          this.no_search_prop = false;
        }
      });
  }

  ngOnDestroy(): void {
    // Cuando el componente se destruya, o lo mismo, se cambie de vista Me desuscribiré a la variable que se encuentra pendiente de los cambios, debido a las peticiones de firebase.
    this.getPropiedadSubscribe.unsubscribe();
    this._lugaresSearchUbicacionService.setPropiedades([]);
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

  // A continuación, cada vez que el usuario haga scroll, procederé a mostrar más propiedades.
  onScroll() {
    // console.log('scrolled!!');

    /* A continuación, se procederá a mostrar las propiedades sin ningún tipo de filtro, de a 3.*/
    if (this.busqueda.filtro != 'true' && this.propiedades != null) {
      let array_prop = this.aux_pro.slice(this.inicio, this.final);

      // Agrego al array propiedades, el nuevo rango de viviendas que quieren mostrarse.
      this.propiedades.push(...array_prop);

      this.inicio = this.final;
      this.final += this.size_query;

      // Proceso la información para poder mostrarla correctamente en pantalla.
      this.procesarDatos(this.propiedades);
    }

    // EL siguiente if, verifica que se está intentando mostrar más propiedades filtradas.
    if (this.busqueda.filtro == 'true' && this.propiedades != null) {
      let array_prop = this.aux_pro_filtro.slice(
        this.inicio_filtro,
        this.final_filtro
      );

      // Agrego al array propiedades, el nuevo rango de viviendas que quieren mostrarse.
      this.propiedades.push(...array_prop);

      this.inicio_filtro = this.final_filtro;
      this.final_filtro += this.size_query;
    }
  }
}
