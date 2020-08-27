import { Injectable } from '@angular/core';
// Importo firestore
import { AngularFirestore } from '@angular/fire/firestore';

// Importo interfaz
import { usuarioModel } from '../models/usuario.model';

import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  // Creo una subscripción para el observable.
  getUsuarioSubscription: Subscription;

  usuariosCollection;
  usuariosDoc;
  usuarios: Observable<any>;

  constructor(public firestore: AngularFirestore) {}

  checkExistedUsuario(usuario: usuarioModel) {
    // Obtengo cada uno de los documentos(usuarios) de la base de datos para posteriormente analizar si es o no necesario agregarlos a la base de datos o no.
    this.usuarios = this.firestore.collection('usuarios').valueChanges();

    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.usuariosCollection = this.firestore.collection('usuarios');

    // En el caso de que la variable user_ex no exista en el localstorage, entonces sí verificaré si el usuario está o no registrado. En caso de que exista, quiere decir que este usaro
    if (!localStorage.getItem('user_ex')) {
      // Divido la cadena obtenida en un array para obtener el número de id Auth0
      let obtener_id_auth = usuario.sub.split('|');

      localStorage.setItem('_u_ky', obtener_id_auth[1]);

      // En primer obtendré
      this.getUsuarioSubscription = this.getUsuarios().subscribe((usuarios) => {
        // Recorreré la lista de usuarios uno por uno en busca de aquel que coincida con el usuario logueado actualmente.
        var usuarioExistente = usuarios.filter(function (usuario) {
          // Compruebo si el id proviente de la base de datos, coincide con el de Auth0.
          if (usuario.sub == obtener_id_auth[1]) {
            // Si se encuentra compatibilidad de ids retorno ese usuario
            return usuario;
          }
        });

        // console.log(usuarioExistente);

        // Si el usuario logueado existe entonces no es necesario que lo vuelva a crear, caso contrario, deberá crearlo en la base de datos.
        if (usuarioExistente.length != 0) {
          console.log('El usuario: existe', usuarioExistente);

          // Si el usuario existe en la base de datos, entonce seteo en el localstorage la existencia del mismo para evitar enviar más peticiones de las correspondientes.
          localStorage.setItem('user_ex', 'true');
        } else {
          // console.log('Agregando usuario');

          // Agrego el usuario en la base de datos con el id proveniente de auth0
          this.usuariosCollection.doc(`${obtener_id_auth[1]}`).set({
            sub: obtener_id_auth[1],
            name: usuario.name,
            email: usuario.email,
            email_verified: usuario.email_verified,
            picture: usuario.picture,
            updated_at: usuario.updated_at,
          });
        }

        // Una vez que obtengo la verificación de que el usuario existe, me desuscribo del observable.
        this.getUsuarioSubscription.unsubscribe();
      });
    } else {
      console.log('El usuario ya existe');
    }
  }

  getUsuarios() {
    // console.log(this.usuarios);
    // Estoy retornando un observable
    return this.usuarios;
  }
}
