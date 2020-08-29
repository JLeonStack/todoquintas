// Modelo de datos de la propiedad
export interface PropiedadModel {
  propiedad: {
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
  img_f: string[];
  user_p: string;
  calificacion: number[];
}

// Modelo de datos de la propiedad
export interface PropiedadModelGet {
  propiedad: {
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
  img_f: string[];
  user_p: string;
  calificacion: number[];
  id_prop: string;
}
