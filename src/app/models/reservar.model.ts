// El siguiente modelo de datos se encarga de gestionar las distintas propiedades que va a tener un documento reserva.
export class ReservarPropiedadModel {
  public personas_hospedar: number;
  public fechas_reservadas: object;
  public precio: number;
  public prop_info: {
    sub: string; // id del usuario Auth0
    name: string; // nombre completo
    email: string; // Email
    email_verified: boolean; // Email verificado o no
    picture: string; // Imagen
    updated_at: string; // Registro.
  };
  public características_propiedad: {
    tipo_propiedad: string;
    nombre_propiedad: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    coordenadas: object;
  };
  public huesped_info: {
    nombre_huesped: string;
    email: string;
    picture: string;
  };
  public reserva_confirmada: number;
  public user_prop_id: string;
  public huesped_id: string;
  public propiedad_id: string;
}
