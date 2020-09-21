import { Injectable } from '@angular/core';
// Importo firestore

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

// Importo interfaz
import { PropiedadModel, PropiedadModelGet } from '../models/propiedad.model';
import { usuarioModel } from '../models/usuario.model';

// Importo servicio
import { UsuariosService } from '../services/usuarios.service';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private CARPETA_IMAGENES = 'img';

  // Creo una subscripción para el observable.
  getPropiedadesSubscription: Subscription;

  private propiedadesCollectionRef: AngularFirestoreCollection;

  // La siguiente es una propiedad que mantendrá las propiedades que tenga un anfitrión en forma persistente para ser utilizado en otros sitios
  public propiedadesPersist: BehaviorSubject<any>;

  constructor(
    private firestore: AngularFirestore,
    private _usuariosService: UsuariosService
  ) {
    this.propiedadesPersist = new BehaviorSubject<any>(false);
  }

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadesCollectionRef = this.firestore.collection('propiedades');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.propiedadesCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }

  //! Este funciona
  cargarImagenesFirebase(imagenes, propiedad: PropiedadModel) {
    return new Promise((resolve, reject) => {
      // crear una referencia a la ruta de acceso root el storage
      const storageRef = firebase.storage().ref();

      let arrayDireccionesURLImagenes = [];

      let primera_imagen = imagenes[0].name.replace(/ /g, '');
      let nombre_primera_imagen = primera_imagen.split('.');

      // El siguiente ciclo for recorrerá cada una de las imágenes colocadas en el drag&Drop y las subirá al servidor.
      for (const item of imagenes) {
        console.log('Itemm imagen', item);

        let file = new File([item], `${item.name.replace(/ /g, '')}`, {
          type: item.type,
        });

        console.log(file);
        // En la siguiente constante que será del tipo UploadTask, almacenaré la referencia de ruta inicial y a su vez

        /* https://firebase.google.com/docs/storage/web/upload-files#top_of_page */

        const uploadTask: firebase.storage.UploadTask = storageRef
          .child(
            `${this.CARPETA_IMAGENES}/${
              propiedad.user_prop_id
            }/${item.name.replace(/ /g, '')}`
          )
          .put(file);

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
                // Agrego al array de direccion urls, las urls de firebase store
                arrayDireccionesURLImagenes.push(downloadURL);

                // console.log('File available at', downloadURL);

                // Si la cantidad e imágenes subidas corresponde con la cantidad de direcciones urls en firebase, entonces, procederé con las siguientes instrucciones.
                if (imagenes.length === arrayDireccionesURLImagenes.length) {
                  // console.log(arrayDireccionesURLImagenes);

                  // El siguiente algoritmo se encargará de colocar en primer lugar la imagen que fue ingresada primera por el usuario
                  for (let i = 0; i < arrayDireccionesURLImagenes.length; i++) {
                    console.log('item 1');
                    if (
                      arrayDireccionesURLImagenes[i].includes(
                        nombre_primera_imagen[0]
                      )
                    ) {
                      let eliminado = arrayDireccionesURLImagenes.splice(i, 1);
                      arrayDireccionesURLImagenes.unshift(eliminado[0]);
                      // console.log(arrayDireccionesURLImagenes);
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

  // La siguiente función se encargará de publicar la propiedad en firebase
  publicarPropiedad(propiedad: PropiedadModel, files) {
    this.verificarConexionFirebase();

    console.log(files);
    return new Promise((resolve, reject) => {
      // Compruebo que efectivamente se hayan enviados fotos, de lo contrario no haré ninguna petición a firebase
      if (files.length != 0) {
        // Cuando se hayan terminado de cargar las imágenes publicaré la propiedad añadiéndole el array de direcciones de imágenes
        this.cargarImagenesFirebase(files, propiedad).then((response: any) => {
          let response_size_fit = [];

          // Recorreré cada una de las ubicaciones de las imágenes en el servidor para poder añadirles a los nombres de las imágenes la nueva extensión.
          for (const item of response) {
            console.log(item);
            let obtener_id_auth = item.split('?');
            let obtener_nombre = obtener_id_auth[0].split('%');
            console.log(obtener_nombre);

            let obtener_extension = obtener_nombre[2].split('.');
            console.log(obtener_extension);
            let nombre_completo_con_extension = `${obtener_nombre[0]}%${obtener_nombre[1]}%${obtener_extension[0]}_800x800.${obtener_extension[1]}?${obtener_id_auth[1]}`;

            response_size_fit.push(nombre_completo_con_extension);
          }

          // Agrego la propiedad img_f a las propiedades para almacenar las direcciones de las fotos que el usuario ha subido
          propiedad['img_f'] = response_size_fit;
          console.log(propiedad['img_f']);

          // A continuación obtengo el id del propietario a través del localstorage
          let id_propietario = localStorage.getItem('_u_ky');

          // ? Realizo una petición al servicio de usuario con el objetivo de guardar en la propiedad toda la información del usuario para, de esta manera, poder desplegarla correctamente a la hora de mostrar las cards, y las visualizaciones de propiedades. [Evitar dos llamadas]
          this._usuariosService
            .retrieveUserInfo(id_propietario)
            .then((user: usuarioModel) => {
              // Agrego una propiedad denominada prop_info, la cual tendrá toda la información del usuario propietario.
              propiedad['prop_info'] = { ...user };

              // Agrego un nuevo documento a la colección con los campos correspondientes a la variable propiedad.
              this.propiedadesCollectionRef
                .add({ ...propiedad })
                .then(() => {
                  resolve(true);
                })
                .catch((err) => {
                  console.log(err);
                  reject(false);
                });
            });
        });
      } else {
        // console.log('No se subió ninguna imagen');
      }
    });
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad(id_usuario: string) {
    this.verificarConexionFirebase();
    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar o eliminar las propiedades.
    return new Promise((resolve, reject) => {
      // Creo una promesa, y busco en la base de datos todas las propiedades que correspondan con el id del propietario logueado.
      this.propiedadesCollectionRef.ref
        .where('user_prop_id', '==', `${id_usuario}`)
        .get()
        .then((doc) => {
          // Creo una variable temporal denominada array, para almacenar las propiedades que devuelva la consulta.
          let array_propiedades_user = [];
          if (doc.empty) {
            reject(false);
          }
          // Recorro el documento que devuelve la base datos.
          doc.forEach((data) => {
            // Pregunto si existe información en cada uno de los documentos de propiedades que estoy recorriendo
            if (data.exists) {
              // Agrego como dato extra al objeto el id del documento, o propiedad.
              array_propiedades_user.push({
                ...data.data(),
                propiedad_id: data.id,
              });
            }
            // Si la cantidad de documentos coincide con la cantidad de propiedades en el array, procedo a resolver la promesa, retornando la información a la vista.
            if (array_propiedades_user.length == doc.size) {
              this.setValue(array_propiedades_user);
              resolve(array_propiedades_user);
            }
          });
        });
    });
  }

  actualizarPropiedad(propiedad, id_propiedad) {
    this.verificarConexionFirebase();

    return new Promise((resolve, reject) => {
      this.propiedadesCollectionRef
        .doc(id_propiedad)
        .update(propiedad)
        .then((data) => {
          console.log('actulizando', data);
          resolve(data);
        });
    });
  }

  eliminarPropiedad(id_propiedad) {
    this.verificarConexionFirebase();

    return new Promise((resolve, reject) => {
      this.propiedadesCollectionRef
        .doc(id_propiedad)
        .delete()
        .then((data) => {
          resolve(data);
        });
    });
  }

  setValue(array_propiedades_user: PropiedadModelGet[]): void {
    this.propiedadesPersist.next(array_propiedades_user);
  }
  getValue(): Observable<PropiedadModelGet[]> {
    return this.propiedadesPersist.asObservable();
  }
}
