import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Esta importanción me permite poder captar los parámetros que envíe por url y procesarlos.
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-propiedad-page',
  templateUrl: './propiedad-page.component.html',
  styleUrls: ['./propiedad-page.component.css'],
})
export class PropiedadPageComponent implements OnInit {
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

    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
    });
  }
  ngOnInit(): void {}
}
