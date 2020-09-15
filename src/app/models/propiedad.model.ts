// Modelo de datos de la propiedad que se publica
export class PropiedadModel {
  public propiedad: {
    tipo_propiedad: string;
    nombre_propiedad: string;
    descripcion: string;
    metros_cuadrado: number;
    metros_cuadrado_cubiertos: number;
    capacidad_alojamiento: number;
    dormitorios: number;
    banos: number;
    solo_familia: boolean;
    piscina: boolean;
    mascotas: boolean;
    apto_eventos: boolean;
    tv: boolean;
    internet: boolean;
    lavarropas: boolean;
    seguridad: boolean;
    aire_acondicionado: boolean;
    calefaccion: boolean;
    jacuzzi: boolean;
    serv_limpieza: boolean;
    ropa_cama: boolean;
    parilla: boolean;

    provincia: string;
    ciudad: string;
    direccion: string;
    coordenadas: object;
    fechas_disponibles: object;
    reserva_veinte_pciento: boolean;
  };
  public user_prop_id: string;
  public img_f: string[];
  public calificacion: number[];
}

// Modelo de datos de la propiedad que se obtiene de la base de datos
export class PropiedadModelGet {
  public propiedad: {
    tipo_propiedad: string;
    nombre_propiedad: string;
    descripcion: string;
    metros_cuadrado: number;
    metros_cuadrado_cubiertos: number;
    capacidad_alojamiento: number;
    dormitorios: number;
    banos: number;
    solo_familia: boolean;
    piscina: boolean;
    mascotas: boolean;
    apto_eventos: boolean;
    tv: boolean;
    internet: boolean;
    lavarropas: boolean;
    seguridad: boolean;
    aire_acondicionado: boolean;
    calefaccion: boolean;
    jacuzzi: boolean;
    serv_limpieza: boolean;
    ropa_cama: boolean;
    parilla: boolean;

    provincia: string;
    ciudad: string;
    direccion: string;
    coordenadas: object;
    fechas_disponibles: object;
    reserva_veinte_pciento: boolean;
  };
  public prop_info: {
    sub: string; // id del usuario Auth0
    name: string; // nombre completo
    email: string; // Email
    email_verified: boolean; // Email verificado o no
    picture: string; // Imagen
    updated_at: string; // Registro.
  };
  public img_f: string[];
  public calificacion: number[];
  public id_prop: string;
  public user_prop_id: string;
  public propiedad_id: string;
}

export class PropiedadCaracteristicas {
  public tipo_propiedad: string;
  public nombre_propiedad: string;
  public descripcion: string;
  public metros_cuadrado: number;
  public metros_cuadrado_cubiertos: number;
  public capacidad_alojamiento: number;
  public dormitorios: number;
  public banos: number;
  public solo_familia: boolean;
  public piscina: boolean;
  public mascotas: boolean;
  public apto_eventos: boolean;
  public tv: boolean;
  public internet: boolean;
  public lavarropas: boolean;
  public seguridad: boolean;
  public aire_acondicionado: boolean;
  public calefaccion: boolean;
  public jacuzzi: boolean;
  public serv_limpieza: boolean;
  public ropa_cama: boolean;
  public parilla: boolean;

  public provincia: string;
  public ciudad: string;
  public direccion: string;
  public coordenadas: object;
  public fechas_disponibles: object;
  public reserva_veinte_pciento: boolean;
}

// El siguiente es el mooelo encargado de mostrar  la propiedad según el id de la ruta en la página /propiedad
export class PropiedadIndividualGetModel {
  public propiedad: {
    tipo_propiedad: string;
    nombre_propiedad: string;
    descripcion: string;
    metros_cuadrado: number;
    metros_cuadrado_cubiertos: number;
    capacidad_alojamiento: number;
    dormitorios: number;
    banos: number;
    solo_familia: boolean;
    piscina: boolean;
    mascotas: boolean;
    apto_eventos: boolean;
    tv: boolean;
    internet: boolean;
    lavarropas: boolean;
    seguridad: boolean;
    aire_acondicionado: boolean;
    calefaccion: boolean;
    jacuzzi: boolean;
    serv_limpieza: boolean;
    ropa_cama: boolean;
    parilla: boolean;

    provincia: string;
    ciudad: string;
    direccion: string;
    coordenadas: object;
    fechas_disponibles: {
      fechas: {
        start: { seconds: number; nanoseconds: number };
        end: { seconds: number; nanoseconds: number };
      }[];
      precios: string[];
    };
    reserva_veinte_pciento: boolean;
  };
  public prop_info: {
    sub: string; // id del usuario Auth0
    name: string; // nombre completo
    email: string; // Email
    email_verified: boolean; // Email verificado o no
    picture: string; // Imagen
    updated_at: string; // Registro.
  };
  public user_prop_id: string;
  public propiedad_id: string;

  public img_f: string[];
  public calificacion: number[];
}
