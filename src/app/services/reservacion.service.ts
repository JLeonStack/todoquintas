import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

// Modelo de datos

import { ReservarPropiedadModel } from '../models/reservar.model';
import { usuarioModel } from '../models/usuario.model';

//Servicios
import { UsuariosService } from '../services/usuarios.service';

import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservacionService {
  // Creo una subscripción para el observable.
  getPropiedadesSubscription: Subscription;

  public reservasCollectionRef: AngularFirestoreCollection;
  public reservaDoc;
  public reservas: Observable<any>;
  public propiedades: Observable<any>;

  // La siguiente
  usuariosCollectionRef: AngularFirestoreCollection;

  constructor(
    private firestore: AngularFirestore,
    private _usuariosService: UsuariosService
  ) {}

  conexiónFirebase() {
    // Obtengo la colección para posteriormente agregar al nuevo usuario a la base de datos de firebase
    this.reservasCollectionRef = this.firestore.collection('reservas');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.reservasCollectionRef) {
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
          this.reservasCollectionRef.add({ ...reserva }).then((data) => {
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

  // La siguiente función me devolverá las distintas reservas según el id de la propiedad.
  getReservas(id_propiedad: string) {
    // Si no existe la conexión la creo
    this.verificarConexionFirebase();

    // Retonarnaré una promesa
    return new Promise((resolve, reject) => {
      // Realizo una consulta a firebase para que me devuelva todas las reservas correspondientes a esta propiedad.
      this.reservasCollectionRef.ref
        .where('propiedad_id', '==', `${id_propiedad}`)
        .get()
        .then((doc) => {
          // Creo unu array
          let reservas = [];
          // Recorro el documento para almacenar en el vector creado anteriormente la información de la reserva.
          doc.forEach((data) => {
            if (data.exists) {
              reservas.push({ ...data.data() });
            }

            if (reservas.length === doc.size) {
              resolve(reservas);
            }
          });
        });
    });
  }
  // La siguiente función se encargará de devolver las reservaciones que han hecho los usuarios a las distintas propiedades
  getReservasRecibidas(id_propiedad: string, confirmada: number) {
    this.verificarConexionFirebase();

    // Retornaré una nueva promesa.
    return new Promise((resolve, reject) => {
      // A conitnuación hago referencia a la colección de referencias, y buscaré todas las reservas que correspondan con el id_propiedad y la confirmación o no de la misma.
      this.reservasCollectionRef.ref
        .where('propiedad_id', '==', `${id_propiedad}`)
        .where('reserva_confirmada', '==', confirmada)
        .get()
        .then((doc) => {
          // Creo un array de reservas temporales para agregar todas las reservas que tenga una propiedad en especíica
          let array_reservas = [];

          // Recorro el documento.
          doc.forEach((data) => {
            // Si existe información en cada uno de los documentos, agrego al array_reservas la información de la reserva junto al id de la misma
            if (data.exists) {
              array_reservas.push({ ...data.data(), id_reserva: data.id });
            }
            // Cuando el tamaño del array de reservas sea igual, a la cantidad de documentos que ha detectado la consulta, procederé a devolver la información a la vista.
            if (array_reservas.length == doc.size) {
              resolve(array_reservas);
            }
          });
        });
    });
  }

  // La siguiente función se encargará de devolver las reservas que ha hecho el usuario, y que el propietario debe confirmar.
  getReservasEnviadas(id_usuario: string, confirmada: number) {
    this.verificarConexionFirebase();

    // Retornaré una nueva promesa.

    return new Promise((resolve, reject) => {
      // A conitnuación hago referencia a la colección de referencias, y buscaré todas las reservas que correspondan con el id del huesped y la confirmación o no de la misma.
      this.reservasCollectionRef.ref
        .where('huesped_id', '==', `${id_usuario}`)
        .where('reserva_confirmada', '==', confirmada)
        .get()
        .then((doc) => {
          let array_reservas = [];
          doc.forEach((data) => {
            // Si existe información en cada uno de los documentos, agrego al array_reservas la información de la reserva junto al id de la misma
            if (data.exists) {
              array_reservas.push({ ...data.data(), id_reserva: data.id });
            }
            // Cuando el tamaño del array de reservas sea igual, a la cantidad de documentos que ha detectado la consulta, procederé a devolver la información a la vista.
            if (array_reservas.length == doc.size) {
              resolve(array_reservas);
            }
          });
        });
    });
  }

  // A través del siguiente método, voy a obtener las propiedades y lo que haré será añadirle el id a cada uno de los documentos para poder hacer referencia a ellos más tarde, cuando deba actualizar las propiedades.

  // La siguiente función confirma la reservación por parte del propietario
  confirmarReservacion(id_propiedad: string) {
    this.verificarConexionFirebase();
    return this.reservasCollectionRef.doc(`${id_propiedad}`).set(
      {
        reserva_confirmada: 1,
      },
      { merge: true }
    );
  }
  // La siguiente función rechaza la reserva por parte del propietario
  rechazarReservacion(id_propiedad: string) {
    this.verificarConexionFirebase();

    return this.reservasCollectionRef.doc(`${id_propiedad}`).delete();
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

  // La siguiente función agrego el id del chat a la reserva que ha sido confirmada
  agregarIdChat(id_chat: string, id_reserva: string) {
    this.verificarConexionFirebase();
    return this.reservasCollectionRef.doc(`${id_reserva}`).set(
      {
        id_chat: id_chat,
      },
      { merge: true }
    );
  }
}
