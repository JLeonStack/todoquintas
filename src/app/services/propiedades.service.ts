import { Injectable } from '@angular/core';
// Importo firestore

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

// Importo interfaz
import { PropiedadModel, PropiedadModelGet } from '../models/propiedad.model';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private CARPETA_IMAGENES = 'img';

  // Creo una subscripción para el observable.
  getPropiedadesSubscription: Subscription;

  propiedadesCollection: AngularFirestoreCollection;
  propiedadesDoc;
  propiedades: Observable<any>;

  constructor(public firestore: AngularFirestore) {
    console.log('Propiedades service iniciado');
  }

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadesCollection = this.firestore.collection('propiedades');
  }

  //! Este funciona
  cargarImagenesFirebase(imagenes) {
    return new Promise((resolve, reject) => {
      // crear una referencia a la ruta de acceso root
      const storageRef = firebase.storage().ref();

      let arrayDireccionesURLImagenes = [];

      let primera_imagen = imagenes[0].name;
      let nombre_primera_imagen = primera_imagen.split('.');
      // El siguiente ciclo for recorrerá cada una de las imágenes colocadas en el drag&Drop y las subirá al servidor.
      for (const item of imagenes) {
        console.log(item);

        // En la siguiente constante que será del tipo UploadTask, almacenaré la referencia de ruta inicial y a su vez

        /* https://firebase.google.com/docs/storage/web/upload-files#top_of_page */

        const uploadTask: firebase.storage.UploadTask = storageRef
          .child(`${this.CARPETA_IMAGENES}/${item.name}`)
          .put(item);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            console.log(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (error) => {
            console.log('Error al subir:', error);
          },
          () => {
            console.log('Imagen cargada correctamente');
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                arrayDireccionesURLImagenes.push(downloadURL);
                console.log('File available at', downloadURL);
                if (imagenes.length === arrayDireccionesURLImagenes.length) {
                  console.log(arrayDireccionesURLImagenes);
                  // El siguiente algoritmo se encargará de colocar en primer lugar la imagen que fue ingresada primera por el usuario
                  for (let i = 0; i < arrayDireccionesURLImagenes.length; i++) {
                    if (
                      arrayDireccionesURLImagenes[i].includes(
                        nombre_primera_imagen[0]
                      )
                    ) {
                      let eliminado = arrayDireccionesURLImagenes.splice(i, 1);
                      arrayDireccionesURLImagenes.unshift(eliminado[0]);
                      resolve(arrayDireccionesURLImagenes);
                    }
                  }
                }
              });
          }
        );
      }
    });
  }

  publicarPropiedad(propiedad, files) {
    this.conexiónFirebase();
    // Compruebo que efectivamente se hayan enviados fotos, de lo contrario no haré ninguna petición a firebase
    if (files.length != 0) {
      // Cuando se hayan terminado de cargar las imágenes publicaré la propiedad añadiéndole el array de direcciones de imágenes
      this.cargarImagenesFirebase(files).then((response: any) => {
        let response_size_fit = [];

        // Recorreré cada una de las ubicaciones de las imágenes en el servidor para poder añadirles a los nombres de las imágenes la nueva extensión.
        for (const item of response) {
          let obtener_id_auth = item.split('?');
          let obtener_nombre = obtener_id_auth[0].split('%');

          let obtener_extension = obtener_nombre[1].split('.');

          let nombre_completo_con_extension = `${obtener_nombre[0]}%${obtener_extension[0]}_800x800.${obtener_extension[1]}?${obtener_id_auth[1]}`;

          response_size_fit.push(nombre_completo_con_extension);
        }

        // Agrego la propiedad img_f a las propiedades para almacenar las direcciones de las fotos que el usuario ha subido
        propiedad['img_f'] = response_size_fit;
        console.log(propiedad['img_f']);
        // Agrego un nuevo documento a la colección con los campos correspondientes a la variable propiedad.

        this.propiedadesCollection.add({ ...propiedad });
      });
    } else {
      console.log('No se subió ninguna imagen');
    }
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad() {
    this.conexiónFirebase();
    // this.propiedades = this.firestore
    //   .collection('propiedades', (ref) => ref.where('usuario', '==', `${usuarioLogueado}`))
    //   .valueChanges();
    let usuarioLogueado = localStorage.getItem('_u_ky');

    console.log('get');
    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.
    return (this.propiedades = this.firestore
      .collection('propiedades', (ref) =>
        ref.where('user_p', '==', `${usuarioLogueado}`)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id_prop = a.payload.doc.id;
            let prop_firebase: PropiedadModelGet = {
              id_prop,
              ...data,
            };
            return prop_firebase;
          })
        )
      ));
  }
}
