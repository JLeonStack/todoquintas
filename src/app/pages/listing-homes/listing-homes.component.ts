import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Rutas
import { ActivatedRoute } from '@angular/router';

// Servicios
import { LugaresSearchUbicacionService } from '../../services/lugares-search-ubicacion.service';

//Modelo de datos
import { Busqueda } from '../../models/busqueda.model';

@Component({
  selector: 'app-listing-homes',
  templateUrl: './listing-homes.component.html',
  styleUrls: ['./listing-homes.component.css'],
})
export class ListingHomesComponent implements OnInit {
  public provincia_buscada: string;
  public ciudad_provincia_ubicacion;

  public busqueda: Busqueda;

  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop: boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla.
  constructor(
    private _observer: BreakpointObserver,
    private route: ActivatedRoute,
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService
  ) {
    this._observer.observe('(min-width: 768px)').subscribe((result) => {
      if (result.matches) {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      } else {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      }
    });
  }

  ngOnInit(): void {
    // A continuación me subscribiré a la ruta con el objetivo de obtener los parámetros de búsqueda que ha solicitado el usuario.
    this.route.queryParamMap.subscribe((params: any) => {
      // Almaceno los parámetros en la propiedad búsqueda
      this.busqueda = { ...params.params };

      // Procesaré la ubicación con el objetivo de desplegar el nombre de la provincia/ciudad en pantalla
      this.provincia_buscada = this.procesarUbicacion(this.busqueda.ubicacion);
      this.ciudad_provincia_ubicacion = this.procesarCiudad(
        this.busqueda.ubicacion
      );

      // Procedo a obtener las propiedades que se ajusten a la búsqueda realizada por el usuario
      this._lugaresSearchUbicacionService.getPropiedad(this.busqueda);
    });
  }

  // La siguiente función se encargará de procesar la ubicación.
  procesarUbicacion(ubicacion: string) {
    let vec_ubicacion = ubicacion.split(',');
    vec_ubicacion.pop();
    // console.log(vec_ubicacion);
    return vec_ubicacion[vec_ubicacion.length - 1];
  }

  // La siguiente función se encargará de procesar la ubicación, para enviar la ciudad + provincia que se ha decidido buscar, eliminando el ARG, al final de la ubicación.
  procesarCiudad(ubicacion: string) {
    let vec_ubicacion = ubicacion.split(',');
    vec_ubicacion.pop();
    return vec_ubicacion;
  }
}
