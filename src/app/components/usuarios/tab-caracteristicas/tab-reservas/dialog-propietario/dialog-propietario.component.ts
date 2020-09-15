import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ReservarPropiedadcModel } from '../../../../../models/reservar.model';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-dialog-propietario',
  templateUrl: './dialog-propietario.component.html',
  styleUrls: ['./dialog-propietario.component.css'],
})
export class DialogPropietarioComponent implements OnInit {
  public reserva: ReservarPropiedadcModel;

  public propietario_info: { email: string; name: string; picture: string };

  constructor(@Inject(MAT_DIALOG_DATA) public data: ReservarPropiedadcModel) {}

  ngOnInit(): void {
    if (this.data) {
      this.reserva = this.data;

      // Si el propietario hace click sobre
      if (this.reserva.tipo_usuario == 'propietario') {
        this.propietario_info = {
          name: this.reserva.huesped_info.nombre_huesped,
          email: this.reserva.huesped_info.email,
          picture: this.reserva.huesped_info.picture,
        };
      } else {
        this.propietario_info = {
          name: this.reserva.prop_info.name,
          email: this.reserva.prop_info.email,
          picture: this.reserva.prop_info.picture,
        };
      }
    }
  }
}
