import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { PropiedadModel, PropiedadModelGet } from '../models/propiedad.model';

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
  propiedades: Observable<any>;

  constructor(public firestore: AngularFirestore) {}

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.reservasCollection = this.firestore.collection('reservas');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.reservasCollection) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }

  reservarPropiedad(reserva) {
    // Si no existe la conexión la creo
    this.verificarConexionFirebase();

    return this.reservasCollection.add({ ...reserva });
  }

  getReservas(id_propiedad) {
    // Si no existe la conexión la creo
    this.verificarConexionFirebase();

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

  // La siguiente función se encargará de devolver las reservaciones que han hecho los usuarios a las distintas propiedades
  getReservasRecibidas(ids_propiedades, confirmada) {
    this.verificarConexionFirebase();
    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.
    return (this.propiedades = this.firestore
      .collection('reservas', (ref) =>
        ref
          .where('propiedad_id', '==', `${ids_propiedades.id_propiedad}`)
          .where('confirmada', '==', confirmada)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id_reserva = a.payload.doc.id;

            const nombre_propiedad = ids_propiedades.nombre;
            let prop_firebase = {
              ...data,
              nombre_propiedad,
              id_reserva,
            };
            return prop_firebase;
          })
        )
      ));
  }

  // La siguiente función se encargará de devolver las reservas que ha hecho el usuario, y que el propietario debe confirmar.
  getReservasEnviadas() {}

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad() {
    this.verificarConexionFirebase();

    let usuarioLogueado = localStorage.getItem('_u_ky');

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

  confirmarReservacion(id_propiedad) {
    this.verificarConexionFirebase();
    return this.firestore.collection('reservas').doc(`${id_propiedad}`).set(
      {
        confirmada: 1,
      },
      { merge: true }
    );
  }
  rechazarReservacion(id_propiedad) {
    this.verificarConexionFirebase();
    return this.firestore
      .collection('reservas')
      .doc(`${id_propiedad}`)
      .delete();
  }
}
