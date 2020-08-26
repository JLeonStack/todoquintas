import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  auth0Subscription: Subscription;

  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop: boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla.
  constructor(
    private _observer: BreakpointObserver,
    public auth: AuthService,
    public _usuariosService: UsuariosService
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
    if (!localStorage.getItem('user_ex')) {
      this.auth0Subscription = this.auth.userProfile$.subscribe(
        (usuarioAuth) => {
          if (usuarioAuth) {
            this._usuariosService.checkExistedUsuario(usuarioAuth);
            console.log(usuarioAuth);
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.auth0Subscription) {
      this.auth0Subscription.unsubscribe();
    }
  }
}
