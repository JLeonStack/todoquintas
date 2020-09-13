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
