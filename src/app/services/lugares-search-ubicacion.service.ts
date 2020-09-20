import { Injectable } from '@angular/core';

// Importo http
import { HttpClient } from '@angular/common/http';

// Importo firestore
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

//Modelo de datos
import { Busqueda } from '../models/busqueda.model';
import { PropiedadIndividualGetModel } from '../models/propiedad.model';

import { Observable, BehaviorSubject } from 'rxjs';

// El providedIn es una forma automática de importar servicios.
@Injectable({
  providedIn: 'root',
})
export class LugaresSearchUbicacionService {
  // Seteo una propiedad del tipo FirestoreCollection
  private propiedadesCollectionRef: AngularFirestoreCollection;

  public provincias: string[] = [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
  ];

  ubicacion_des: { ciudad: string; provincia: string } = {
    ciudad: '',
    provincia: '',
  };

  public propiedades: BehaviorSubject<PropiedadIndividualGetModel[]>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.propiedades = new BehaviorSubject<any>(false);
  }

  // La siguiente función se encarga de devolver las sugerencias en base a las letras ingresadas por el usuario en el input search.
  obtenerLugar(word_search: string) {
    return this.http.get(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=ARG&text=${word_search}&category=City`
    );
  }

  conexiónFirebase() {
    // A continuación creo una referencia a la colección usuarios
    this.propiedadesCollectionRef = this.firestore.collection('propiedades');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.propiedadesCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad(busqueda: Busqueda) {
    this.verificarConexionFirebase();

    console.log(busqueda);

    // Proceso la ubicación que se acaba de buscar, para extraer ciudad y provincia, y de esta manera, realizar la consulta a firebase
    this.procesarUbicacion(busqueda.ubicacion);

    console.log(this.ubicacion_des);

    var consulta;

    if (busqueda.propiedad == 'cualquiera') {
      // Proceso a realizar la consulta a firebase.
      consulta = this.propiedadesCollectionRef.ref
        .where('propiedad.provincia', '==', `${this.ubicacion_des.provincia}`)
        .where('propiedad.ciudad', '==', `${this.ubicacion_des.ciudad}`)
        .where(
          'propiedad.capacidad_alojamiento',
          '>=',
          parseInt(busqueda.huespedes)
        );
    } else {
      // Proceso a realizar la consulta a firebase.
      consulta = this.propiedadesCollectionRef.ref
        .where('propiedad.provincia', '==', `${this.ubicacion_des.provincia}`)
        .where('propiedad.ciudad', '==', `${this.ubicacion_des.ciudad}`)
        .where('propiedad.tipo_propiedad', '==', `${busqueda.propiedad}`)
        .where(
          'propiedad.capacidad_alojamiento',
          '>=',
          parseInt(busqueda.huespedes)
        );
    }

    consulta.get().then((doc) => {
      if (!doc.empty) {
        // Creo una variable temporal denominada array, para almacenar las propiedades que devuelva la consulta.
        let array_propiedades = [];

        // Recorro el documento que devuelve la base datos.
        doc.forEach((data) => {
          // Pregunto si existe información en cada uno de los documentos de propiedades que estoy recorriendo
          if (data.exists) {
            // Agrego como dato extra al objeto el id del documento, o propiedad.
            array_propiedades.push({
              ...data.data(),
              propiedad_id: data.id,
            });
          }
          // Si la cantidad de documentos coincide con la cantidad de propiedades en el array, procedo a resolver la promesa, retornando la información a la vista.
          if (array_propiedades.length == doc.size) {
            this.setPropiedades(array_propiedades);
          }
        });
      } else {
        this.setPropiedades([]);
      }
    });
  }

  // La siguiente función se encargará de procesar la ubicación de manera tal de poder enviar como consulta a firebase la provincia y la ciudad de las propiedades.
  procesarUbicacion(ubicacion: string) {
    let ubicacion_v = ubicacion.split(',');
    // console.log(ubicacion_v);
    for (let i = 0; i < this.provincias.length; i++) {
      for (let j = 0; j < ubicacion_v.length; j++) {
        if (ubicacion_v[j].trim() == this.provincias[i].trim()) {
          this.ubicacion_des.provincia = this.provincias[i].trim();
        }
      }
    }

    this.ubicacion_des.ciudad = this.quitarAcentos(
      this.removeAccents(ubicacion_v[0].trim())
    );
  }

  removeAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  quitarAcentos(str) {
    const acentos = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
    };
    return str
      .split('')
      .map((letra) => acentos[letra] || letra)
      .join('')
      .toString()
      .toLowerCase();
  }

  // Las siguientes funciones se encargarán de gestionar los datos almacenados en la variable "propiedad" que se mostrarán cuando el usuario decida realizar la búsqueda:

  setPropiedades(array_propiedades: PropiedadIndividualGetModel[]): void {
    this.propiedades.next(array_propiedades);
  }
  getPropiedades(): Observable<PropiedadIndividualGetModel[]> {
    return this.propiedades.asObservable();
  }
}
