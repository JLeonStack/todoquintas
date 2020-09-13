import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Esta importanción me permite poder captar los parámetros que envíe por url y procesarlos.
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-propiedad-page',
  templateUrl: './propiedad-page.component.html',
  styleUrls: ['./propiedad-page.component.css'],
})
// Los componentes son simples clases de Javascript con decoradores.
export class PropiedadPageComponent implements OnInit {
  // En esta propiedad se cargará la información de la propiedad que decida ver el usuario
  propiedad: any[];

  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop: boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla.
  constructor(
    private _observer: BreakpointObserver,
    private activatedRoute: ActivatedRoute
  ) {
    // El siguiente observador se encargará de llevar un control del tamaño que contiene la pantalla para poder mostrar o ocultar las diferentes barras de navegación
    this._observer.observe('(min-width: 768px)').subscribe((result) => {
      if (result.matches) {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      } else {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      }
    });

    // Procederé a capturar los parámetros que se vayan a enviar, que será especialmente, el id de la propiedad que deseo visualizar.
    /*  Una vez capturado el id de la propiedad, procederé a realizar una petición fetch a la API para que me traiga toda la información relacionada a esa propiedad.  */
    this.activatedRoute.params.subscribe((params) => {
      // Aquí adentro irá el fetch a la API para que me atraiga toda la información correspondiente a la propiedad
      // console.log(params);
    });
  }

  // ngOnInit permite realizar acciones durante el tiempo de ejecución del programa.
  ngOnInit(): void {}
}
