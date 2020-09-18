export class usuarioModel {
  public sub: string; // id del usuario Auth0
  public name: string; // nombre completo
  public email: string; // Email
  public email_verified: boolean; // Email verificado o no
  public picture: string; // Imagen
  public updated_at: string; // Registro.
  public fecha_nacimiento: Date; // Fecha de nacimiento
  public telefono: string; //Telefono
}

export class actualizarUsuarioModel {
  public sub: string; // id del usuario Auth0
  public name: string; // nombre completo
  public fecha_nacimiento: Date;
  public telefono: string;
  public email: string; // Email
  public picture: string; // Imagen
}
