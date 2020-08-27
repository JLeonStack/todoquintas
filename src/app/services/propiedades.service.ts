import { Injectable } from '@angular/core';
// Importo firestore

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

// Importo interfaz
import { propiedadModel } from '../models/propiedad.model';

import { Observable, Subscription, config } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileItem } from '../models/file-item';

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
    // Obtengo cada uno de los documentos(usuarios) de la base de datos para posteriormente analizar si es o no necesario agregarlos a la base de datos o no.
    // this.propiedades = this.firestore
    //   .collection('propiedades', (ref) => ref.where('usuario', '==', '1234'))
    //   .valueChanges();
  }

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadesCollection = this.firestore.collection('propiedades');
  }

  cargarImagenesFirebase(imagenes) {
    // crear una referencia a la ruta de acceso root
    const storageRef = firebase.storage().ref();

    let arrayDireccionesURLImagenes = [];

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
          console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          console.log('Error al subir:', error);
        },
        () => {
          console.log('Imagen cargada correctamente');
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            arrayDireccionesURLImagenes.push(downloadURL);
            console.log('File available at', downloadURL);
            if (imagenes.length == arrayDireccionesURLImagenes) {
              return arrayDireccionesURLImagenes;
            }
          });
        }
      );
    }
  }

  cargarImagenes_2(imagenes) {
    return new Promise((resolve, reject) => {
      // crear una referencia a la ruta de acceso root
      const storageRef = firebase.storage().ref();

      let arrayDireccionesURLImagenes = [];

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
                  resolve(arrayDireccionesURLImagenes);
                }
              });
          }
        );
      }
    });
  }

  private guardarImagen(imagen: { nombre: string; url: string }) {
    this.firestore.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }

  publicarPropiedad(propiedad, files) {
    this.conexiónFirebase();
    // Cuando se hayan terminado de cargar las imágenes publicaré la propiedad añadiéndole el array de direcciones de imágenes
    this.cargarImagenes_2(files).then((response) => {
      console.log(response);
      propiedad['img_f'] = response;
      this.propiedadesCollection.add(propiedad);
    });
    // Agrego un nuevo documento a la colección con los campos correspondientes a la variable propiedad.
    console.log('Se publicó antes');
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad() {
    this.conexiónFirebase();
    console.log('get');
    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.
    this.propiedades = this.propiedadesCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    this.propiedades.subscribe((data) => {
      console.log(data);
    });
  }
}
