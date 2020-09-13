import { Injectable } from '@angular/core';

// Importo firestore
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

// Importo modelo de datos
import { usuarioModel } from '../models/usuario.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  // Las sigueintes propiedades serán referencias hacia la base de datos.
  private usuariosCollectionRef: AngularFirestoreCollection;

  public usuarios: Observable<any>;

  constructor(private firestore: AngularFirestore) {}

  conexiónFirebase() {
    // A continuación creo una referencia a la colección usuarios
    this.usuariosCollectionRef = this.firestore.collection('usuarios');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.usuariosCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }
  // La siguiente función se encargará de evaluar si el usuario que se acaba de loguear con Auth0, existe en firebase.
  checkUserExists(usuario: usuarioModel): void {
    // Procedemos a verificar si existe una conexión, si no la hay, crearemos una
    this.verificarConexionFirebase();

    // Obtengo el id auth0;
    let obtener_id_auth = usuario.sub.split('|');
    let id_auth = obtener_id_auth[1];

    // Una vez que creo la referencia hacia los usuarios, compruebo si existe registrado el usuario de Auth0 en nuestra colección usuarios.
    this.usuariosCollectionRef.ref
      .where('sub', '==', `${id_auth}`)
      .get()
      .then((data) => {
        // Al utilizar la query where, de nos devolverá un objeto con una propiedad empty, la cual nos dirá si el documento ha venido lleno o no.
        /* En caso de que haya venido vacío, devolverá true, y si viene lleno, un false.*/
        if (data.empty) {
          // El siguiente objeto será un "Usuario Auth" que será almacenado en nuestra base de datos.
          let user_auth0: usuarioModel = {
            sub: id_auth,
            name: usuario.name,
            email: usuario.email,
            email_verified: usuario.email_verified,
            picture: usuario.picture,
            updated_at: usuario.updated_at,
          };

          // A continuación vuelvo a hacer referencia a la colección de usuarios, en esta ocasión, para almacenar un nuevo usuario id, y le mandaré un objeto con la información de auth0.
          this.usuariosCollectionRef
            .doc(`${id_auth}`)
            .set(user_auth0)
            .then(() => {
              // Almaceno en el localStorage el id del usuario
              this.setUserIdLocalStorage(id_auth);

              // console.log('Se ha guardado el usuario en firebase');
            })
            .catch((err) => {
              // console.log(err);
            });
        } else {
          // Almaceno en el localStorage el id del usuario
          this.setUserIdLocalStorage(id_auth);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setUserIdLocalStorage(user_id: string) {
    localStorage.setItem('_u_ky', user_id);
  }

  retrieveUserInfo(id_user: string) {
    // Procedemos a verificar si existe una conexión, si no la hay, crearemos una
    this.verificarConexionFirebase();

    // Retornamos una premisa con la información del usuario seleccionado
    return new Promise((resolve, reject) => {
      this.usuariosCollectionRef.ref
        .where('sub', '==', `${id_user}`)
        .get()
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((data) => {
              resolve(data.data());
            });
          }
        });
    });
  }
}
