import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PropiedadIndividualService {
  propiedadCollectionRef: AngularFirestoreCollection;

  constructor(public firestore: AngularFirestore) {}

  // La siguiente función realizo una conexión a firebase.
  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadCollectionRef = this.firestore.collection('propiedades');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.propiedadCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }
  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad(propiedad_id: string) {
    this.verificarConexionFirebase();

    return new Promise((resolve, reject) => {
      this.propiedadCollectionRef
        .doc(propiedad_id)
        .get()
        .forEach((data) => {
          resolve({ ...data.data(), propiedad_id: data.id });
        });
    });
  }
}
