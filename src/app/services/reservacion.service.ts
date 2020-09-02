import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import * as firebase from 'firebase';

import { Observable, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReservacionService {
  // Creo una subscripción para el observable.
  getPropiedadesSubscription: Subscription;

  reservasCollection: AngularFirestoreCollection;
  reservaDoc;
  reservas: Observable<any>;

  constructor(public firestore: AngularFirestore) {}

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.reservasCollection = this.firestore.collection('reservas');
  }

  reservarPropiedad() {}

  getReservas() {}
}
