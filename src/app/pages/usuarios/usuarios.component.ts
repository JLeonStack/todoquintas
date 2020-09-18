import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Importo AuthService
import { AuthService } from '../../services/auth.service';

// Servicio encargado de traer información sobre los usuarios.
import { UsuariosService } from '../../services/usuarios.service';

// Importo modelo de datos
import { usuarioModel } from '../../models/usuario.model';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  // La siguiente es la subscripción de Auth0.
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
    // El siguiente es un observador que estará escuchando los cambios en las dimensiones de la pantalla.
    this._observer.observe('(min-width: 768px)').subscribe((result) => {
      // Si las dimensiones coinciden con lo especificado, procederé a habilitar el menú de navegación movil.
      if (result.matches) {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      } else {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      }
    });
  }

  // !Importante
  /* A continuación, me subscribiré a auth0 para obtener la información del usuario que se acaba de registrar o ingresar en el sitio web */
  /* Para evitar que esta operación se repita múltiples veces, procederé a almacenar el id del usuario en el localStorage. */

  ngOnInit(): void {
    // Si no existe el usuario almacenado en base de datos, entonces procederé a recibir la información de Auth0, y verificar si el usuario existe.
    if (localStorage.getItem('_u_ky') == null) {
      this.auth0Subscription = this.auth.userProfile$.subscribe(
        (usuarioAuth: usuarioModel) => {
          // Realizo una pequeña validación, asegurándome que obtengo los datos provenientes de auth0.
          if (usuarioAuth) {
            // Procedo a chequear si el usuario que se acaba de registrar pertenece o no
            this._usuariosService.checkUserExists(usuarioAuth);
            // console.log(usuarioAuth);
          }
        }
      );
    }
  }

  ngOnDestroy() {
    // Si existe una subscripción de auth 0, procedo a desuscrbrirme de ella cuando el componente se destruya: el usuario cambie de página.
    if (this.auth0Subscription) {
      this.auth0Subscription.unsubscribe();
    }
  }
}
