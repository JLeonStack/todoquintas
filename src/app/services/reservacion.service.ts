import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

// Modelo de datos
import { PropiedadModelGet } from '../models/propiedad.model';
import { ReservarPropiedadModel } from '../models/reservar.model';
import { usuarioModel } from '../models/usuario.model';

//Servicios
import { UsuariosService } from '../services/usuarios.service';

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

  // La siguiente
  usuariosCollectionRef: AngularFirestoreCollection;

  constructor(
    private firestore: AngularFirestore,
    private _usuariosService: UsuariosService
  ) {}

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

  /* La siguiente función se encarga de agregar la reservación en firebase. 
  ! En este caso adicionaré información del usuario al documento para posteriormente utilizarla a la hora de mostrar las reservaciones y evitar un doble llamado a firebase. */
  reservarPropiedad(reserva: ReservarPropiedadModel) {
    // Si no existe la conexión la creo
    this.verificarConexionFirebase();

    // Creo y retornaré una premisa para veriicar si se ha cargado satisfactoriamente la reserva
    return new Promise((resolve, reject) => {
      // A continuación llamo al servicio "Usuarios" para pedir información del huesped que se encuentra reservando una propiedad y poder cargar esta Info en la reserva.
      this._usuariosService
        .retrieveUserInfo(reserva.huesped_id)
        .then((data: usuarioModel) => {
          console.log(data);

          // Agrego la información del huesped al objeto reserva.
          reserva.huesped_info = {
            nombre_huesped: data.name,
            email: data.email,
            picture: data.picture,
          };

          // Agrego la reserva a la colección de reservas.
          this.reservasCollection.add({ ...reserva }).then((data) => {
            // Retorno la data que devuelva el hecho de agregar la reserva a la colección.
            resolve(data);
          });
        })
        .catch((err) => {
          // Capturo error, y lo retorno al componente de reserva.
          reject(err);
        });
    });
  }

  // La siguiente función creará un listener a firestore para estar pendiente en los cambios de
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
