import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropiedadIndividualService {
  // Creo una subscripción para el observable.
  getPropiedadSubscription: Subscription;

  propiedadCollection: AngularFirestoreCollection;
  propiedadDoc;
  propiedad: Observable<any>;

  constructor(public firestore: AngularFirestore) {}

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.propiedadCollection = this.firestore.collection('propiedades');
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad(propiedad_id: string) {
    this.conexiónFirebase();
    return (this.propiedad = this.firestore
      .collection('propiedades')
      .doc(propiedad_id)
      .get());
  }

  // Con el siguiente método obtendré lo información del usuario
  getUserInfo(user_id: string) {
    this.conexiónFirebase();
    return (this.propiedad = this.firestore
      .collection('usuarios')
      .doc(user_id)
      .get());
  }
}
