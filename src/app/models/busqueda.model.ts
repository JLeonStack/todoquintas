export class Busqueda {
  public ubicacion: string;
  public propiedad: string;
  public huespedes: number;

  //   Filtros
  public dormitorios?: number;
  public banos?: number;

  // Detalles
  public wifi?: boolean;
  public piscina?: boolean;
  public seguridad?: boolean;
  public tv?: boolean;

  //      Servicios
  public mascotas?: boolean;
  public solo_familia?: boolean;
  public serv_limpieza?: boolean;
  public parilla?: boolean;
  public aire_acondicionado?: boolean;
}
