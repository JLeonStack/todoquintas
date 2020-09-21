import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesHomeService {
  public propiedadesCollectionRef: AngularFirestoreCollection;

  constructor(private firestore: AngularFirestore) {}

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

  getPropiedades() {
    this.verificarConexionFirebase();

    return new Promise((resolve, reject) => {
      this.propiedadesCollectionRef.get().subscribe((doc) => {
        if (doc.empty) {
          reject(false);
        }
        let array_prop = [];
        doc.forEach((data) => {
          array_prop.push({ ...data.data(), propiedad_id: data.id });

          if (doc.size == array_prop.length) {
            resolve(array_prop);
          }
        });
      });
    });
  }
}
