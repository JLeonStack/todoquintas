import { Injectable } from '@angular/core';

// Importo Firebase
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

// Modelo de datos
import {
  actualizarUsuarioModel,
  usuarioModel,
} from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private CARPETA_IMAGENES = 'img';

  private usuarioCollectionRef: AngularFirestoreCollection;

  constructor(private firestore: AngularFirestore) {}

  conexiónFirebase(): void {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.usuarioCollectionRef = this.firestore.collection('usuarios');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase(): void {
    if (!this.usuarioCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }

  // Con la siguiente función subo una imagen a firebase.
  subirImagen(
    file: File,
    id_usuario: string,
    nombre_archivo: string
  ): Promise<any> {
    // Creo una constante donde definiré información que enviaré a firebase.
    const objeto_subir = {
      nombre_archivo: nombre_archivo,
      id_usuario: id_usuario,
    };
    // Creo una referencia raíz al storage
    const storageRef = firebase.storage().ref();

    // Retorno una promesa, con la dirección url de descarga en firebase.
    return new Promise((resolve, reject) => {
      // Creo una referencia a la imagen que subiré. Create a reference to 'mountains.jpg'
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(
          `${this.CARPETA_IMAGENES}/${objeto_subir.id_usuario}/${objeto_subir.nombre_archivo}`
        )
        .put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // A continuación muestro el porcentaje de carga de la imagen.
          // console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          // En caso de que haya un error, imprimo dicho error
          console.log('Error al subir:', error);
        },
        () => {
          // console.log('Imagen cargada correctamente');

          // Obtengo la url de descarga
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            // A continuación realizo el proceso para poder añadirle a la dirección url de descarga la nueva dimensiones de la imagen: 800x800
            let obtener_id_auth = downloadURL.split('?');
            let obtener_nombre = obtener_id_auth[0].split('%');
            // console.log(obtener_nombre);

            let obtener_extension = obtener_nombre[2].split('.');
            // console.log(obtener_extension);

            let nombre_completo_con_extension = `${obtener_nombre[0]}%${obtener_nombre[1]}%${obtener_extension[0]}_800x800.${obtener_extension[1]}?${obtener_id_auth[1]}`;

            // Luego del proceso realizo devuelvo el nombre de la imagen junto con la nueva extensión
            resolve(nombre_completo_con_extension);
          });
        }
      );
    });
  }

  // La siguiente función actualizará la información del usuario
  actualizarInfo(
    user: actualizarUsuarioModel,
    file: File,
    id_usuario: string,
    nombre_archivo: string
  ): Promise<any> {
    this.verificarConexionFirebase();

    // Retornaré una premisa
    return new Promise((resolve, reject) => {
      let usuario = {
        sub: user.sub,
        name: user.name,
        fecha_nacimiento: user.fecha_nacimiento,
        telefono: user.telefono,
        email: user.email,
        picture: user.picture,
      };

      if (file) {
        this.subirImagen(file, id_usuario, nombre_archivo).then((urlImg) => {
          usuario.picture = urlImg;

          // Procedo a actualizar la información del usuario
          this.usuarioCollectionRef
            .doc(usuario.sub)
            .update({ ...usuario })
            .then((data) => {
              resolve(data);
            });
        });
      } else {
        // Procedo a actualizar la información del usuario
        this.usuarioCollectionRef
          .doc(usuario.sub)
          .update({ ...usuario })
          .then((data) => {
            resolve(data);
          });
      }
    });
  }
}
