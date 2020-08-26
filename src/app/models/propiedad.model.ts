export interface propiedadModel {
  propiedad: string;
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

  provincia: object;
  coordenadas: object;
  fechas_disponibles: object;
}
