import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Importo servicios
import { UsuariosService } from '../../../../../services/usuarios.service';
import { Subscription } from 'rxjs';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-dialog-propietario',
  templateUrl: './dialog-propietario.component.html',
  styleUrls: ['./dialog-propietario.component.css'],
})
export class DialogPropietarioComponent implements OnInit {
  usuarioInfoSubscription: Subscription;

  user_info = {
    email: null,
    name: null,
    picture: null,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    let user_p_id = this.data[0];
    this.usuarioInfoSubscription = this._usuariosService
      .recuperarUserInformation(user_p_id)
      .subscribe((data: any) => {
        this.user_info.picture = data[0].picture;
        this.user_info.name = data[0].name;
        this.user_info.email = data[0].email;
        console.log('Propietario info:', data);
      });
  }
}
