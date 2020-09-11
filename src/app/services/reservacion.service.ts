import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { PropiedadModel, PropiedadModelGet } from '../models/propiedad.model';

import * as firebase from 'firebase';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface Reserva {
  confirmada: number;
  fechas_reservadas: { start: string; end: string };
  id_reserva: string;
  personas_hospedar: number;
  precio: number;
  propiedad_id: string;
  usuario: string;
}

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
  usuarios;

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
    return this.userInfo(reserva.usuario).then((data: any) => {
      console.log(data.data());
      reserva.info_huesped = {};
      reserva.info_huesped.nombre_huesped = data.data().name;
      reserva.info_huesped.picture = data.data().picture;
      return this.reservasCollection.add({ ...reserva });
    });
  }

  // Retornaré una promesa, de tal forma que yo pueda retornar información hacia los componentes una vez que se ha producido una operación asincrónica.
  userInfo(id_user) {
    return new Promise((resolve, reject) => {
      this.recuperarUserInformation(id_user).subscribe((data) => {
        // Una vez que recibo la información, llamo al resolve, indicando que ha completado esta operación de buscar la información del usuario, para posteriormente, capturar esta información con un then()
        resolve(data);
      });
    });
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
  getReservasRecibidas(id_propiedad: string, confirmada: number) {
    this.verificarConexionFirebase();
    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.
    return (this.propiedades = this.firestore
      .collection('reservas', (ref) =>
        ref
          .where('propiedad_id', '==', `${id_propiedad}`)
          .where('confirmada', '==', confirmada)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id_reserva = a.payload.doc.id;
            let reserva_firebase = {
              ...data,
              id_reserva,
            };
            return reserva_firebase;
          })
        )
      ));
  }

  recuperarUserInformation(id_user) {
    return (this.usuarios = this.firestore
      .collection('usuarios')
      .doc(id_user)
      .get());
  }

  // La siguiente función se encargará de devolver las reservas que ha hecho el usuario, y que el propietario debe confirmar.
  getReservasEnviadas(id_usuario: string, confirmada: number) {
    this.verificarConexionFirebase();

    // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.
    return (this.propiedades = this.firestore
      .collection('reservas', (ref) =>
        ref
          .where('usuario', '==', `${id_usuario}`)
          .where('confirmada', '==', confirmada)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id_reserva = a.payload.doc.id;
            let reserva_firebase = {
              ...data,
              id_reserva,
            };
            return reserva_firebase;
          })
        )
      ));
  }

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

  // La siguiente función confirma la reservación por parte del propietario
  confirmarReservacion(id_propiedad) {
    this.verificarConexionFirebase();
    return this.firestore.collection('reservas').doc(`${id_propiedad}`).set(
      {
        confirmada: 1,
      },
      { merge: true }
    );
  }
  // La siguiente función rechaza la reserva por parte del propietario
  rechazarReservacion(id_propiedad) {
    this.verificarConexionFirebase();
    return this.firestore
      .collection('reservas')
      .doc(`${id_propiedad}`)
      .delete();
  }

  // La siguiente función se encarga de adicionar a la reserva, una vez que es pagada con mercadopago la inormación del usuario de MercadoPago y si el pago fue o no aprobado, para posteriormente mostrar información del propietario.
  agregarInfoPagoReserva(id_reserva, info_mp) {
    this.verificarConexionFirebase();
    return this.firestore.collection('reservas').doc(`${id_reserva}`).set(
      {
        info_mp: info_mp,
      },
      { merge: true }
    );
  }
}
