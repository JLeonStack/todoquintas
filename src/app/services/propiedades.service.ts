import { Injectable } from '@angular/core';
// Importo firestore

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

// Importo interfaz
import { propiedadModel } from '../models/propiedad.model';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  // Creo una subscripción para el observable.
  getPropiedadesSubscription: Subscription;

  propiedadesCollection: AngularFirestoreCollection;
  propiedadesDoc;
  propiedades: Observable<any>;

  constructor(public firestore: AngularFirestore) {
    // Obtengo cada uno de los documentos(usuarios) de la base de datos para posteriormente analizar si es o no necesario agregarlos a la base de datos o no.
    // this.propiedades = this.firestore
    //   .collection('propiedades', (ref) => ref.where('usuario', '==', '1234'))
    //   .valueChanges();

    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadesCollection = this.firestore.collection('propiedades');
  }

  publicarPropiedad(propiedad) {
    // Agrego un nuevo documento a la colección con los campos correspondientes a la variable propiedad.
    this.propiedadesCollection.add(propiedad);
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad() {
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
