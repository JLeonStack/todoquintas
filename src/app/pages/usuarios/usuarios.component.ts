import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop: boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla.
  constructor(private _observer: BreakpointObserver, public auth: AuthService) {
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
    // this.auth.userProfile$.subscribe((data) => {
    //   console.log(data);
    // });
  }
}
