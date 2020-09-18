import { Component, OnInit } from '@angular/core';

// Importanciones para manejar los formularios
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Servicios
import { UploadImageService } from '../../../../services/firebase/actualizar_info_user.service';
import { UsuariosService } from '../../../../services/usuarios.service';

// Modelos
import { usuarioModel } from '../../../../models/usuario.model';

@Component({
  selector: 'app-tab-datos-usuario',
  templateUrl: './tab-datos-usuario.component.html',
  styleUrls: ['./tab-datos-usuario.component.css'],
})
export class TabDatosUsuarioComponent implements OnInit {
  public form_user: FormGroup;

  private file: File;
  private nombre_archivo: string;
  private user_id: string;

  public boton_actualizar = false;

  public loading = false;

  public imagen: string =
    'https://firebasestorage.googleapis.com/v0/b/todoquintas-arg.appspot.com/o/logo_800x800.png?alt=media&token=fb9d0935-c18c-4898-8a16-e48fef6fcec9';

  constructor(
    private _fb: FormBuilder,
    private _uploadImageService: UploadImageService,
    private _usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    // Creo el formulario que controlará los diferentes inputs.
    this.crearFormUser();

    // Procederé a través de un observable, de monitorear el valor que se encuentra en el LocalStorage, de tal manera que, una vez yo detecte un valor en él, procedo a pedir información del usuario
    this._usuariosService.getValue().subscribe((user_id_local_storage) => {
      console.log('User id: ', user_id_local_storage);
      this.user_id = user_id_local_storage;
      // Al cargarse el componente, solicito el profile del usuario para desplegar la información en el formulario.
      this._usuariosService
        .retrieveUserInfo(this.user_id)
        .then((data: usuarioModel) => {
          // Con la información proveniente de firebase, proceso a establecer en el formulario información para mostrar en los inputs.
          this.imagen = data.picture;
          this.form_user.get('picture').setValue(data.picture);
          this.form_user.get('email').setValue(data.email);
          this.form_user.get('name').setValue(data.name);
          this.form_user.get('telefono').setValue(data.telefono);
          this.form_user
            .get('fecha_nacimiento')
            .setValue(data.fecha_nacimiento);
          this.form_user.get('sub').setValue(data.sub);

          // console.log(data);
        });
    });
  }

  // La siguiente función creará el formulario con los formcontrols del formulario.
  crearFormUser() {
    this.form_user = this._fb.group({
      name: ['', Validators.required],
      email: [''],
      telefono: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      picture: [],
      sub: [''],
    });
  }

  // La siguiente función se encargará de ejecutar
  guardarFormulario() {
    // Si el formulario cumple con todos los requisitos, se procederá a actualizaar la info del usuario
    if (this.form_user.valid) {
      this.boton_actualizar = true;
      this.loading = true;

      this._uploadImageService
        .actualizarInfo(
          this.form_user.value,
          this.file,
          this.user_id,
          this.nombre_archivo
        )
        .then(() => {
          this.loading = false;
          location.reload();
        });
    }
  }

  // La siguiente función se encargará de capturar la información de la imagen que decida subirse.
  onFileSelected(event) {
    // Siempre y cuando se haya cargado una imagen procederé a ejecutar el siguiente conjunto de instrucciones
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];

      // Almaceno el src de la imagen subida para posteriormente realizar un
      let src = URL.createObjectURL(this.file);
      // Procedo a hacer referencia al elemento.
      let preview = document.getElementById('image-preview');

      // Seteo una previsualización de la imagen
      preview.setAttribute('src', src);

      // A continuación procederé a establecer un nombre estándar a la imagen cargada por el usuario, para que en un futuro, si desea cambiarla nuevamente, se reemplace la anterior por la nueva, ahorrando espacio en firebase.
      let nombre_archivo_div = this.file.name.split('.');

      for (const item of nombre_archivo_div) {
        if (item == 'png') {
          this.nombre_archivo = 'foto_perfil.png';
        }
        if (item == 'jpg') {
          this.nombre_archivo = 'foto_perfil.jpg';
        }
      }
    }
  }
}
