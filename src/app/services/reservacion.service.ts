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

  reservarPropiedad(reserva) {
    // Si no existe la conexión la creo
    if (!this.reservasCollection) {
      this.conexiónFirebase();
    }

    return this.reservasCollection.add({ ...reserva });
  }

  getReservas(id_propiedad) {
    // Si no existe la conexión la creo

    if (!this.reservasCollection) {
      this.conexiónFirebase();
    }
    return (this.reservas = this.firestore
      .collection('reservas', (ref) =>
        ref.where('propiedad_id', '==', `${id_propiedad}`)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id_prop = a.payload.doc.id;
            let reserva_firebase = {
              ...data,
            };
            return reserva_firebase;
          })
        )
      ));
  }
}
