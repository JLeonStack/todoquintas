import { Component, OnInit, OnDestroy } from '@angular/core';

// Importo las funciones para trabajar con formularios
import { FormGroup, FormBuilder } from '@angular/forms';

// Servicios
import { ReservacionService } from '../../../../services/reservacion.service';
import { PropiedadesService } from '../../../../services/propiedades.service';
import { DialogPropietarioComponent } from './dialog-propietario/dialog-propietario.component';

// Dialog
import { MatDialog } from '@angular/material/dialog';

// Modelos
import { ReservarPropiedadModel } from '../../../../models/reservar.model';

import { PropiedadModelGet } from '../../../../models/propiedad.model';

import { Subscription } from 'rxjs';

// Interfaces
interface data_input_select {
  propiedad_id: string;
  confirmada: string;
}

@Component({
  selector: 'app-tab-reservas',
  templateUrl: './tab-reservas.component.html',
  styleUrls: ['./tab-reservas.component.css'],
})
export class TabReservasComponent implements OnInit, OnDestroy {
  // El siguiente array almacenará las propiedades que tenga publicada el propietario
  array_id_propiedades = [];

  propiedad_seleccionada: FormGroup;

  // La siguiente propiedad se encargará de gestionar las reservas enviadas por los usuarios, particularmente, si éstas están confirmadas o no.
  reserva_seleccionada: FormGroup;

  reservas_enviadas: ReservarPropiedadModel[];
  reserva_bandera_env = true;

  // En el siguiente array almacenaré las distintas fechas de reservaciones que se han hecho a las propiedades
  reservas: ReservarPropiedadModel[];
  reserva_bandera = true;

  constructor(
    private _reservacionService: ReservacionService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _propiedadesService: PropiedadesService
  ) {}
  ngOnInit(): void {
    this.crearFormulario();

    // En primer lugar, obtendré las propiedades del usuario para posteriormente extraer los id's, y los nombres de la mismas con el objetivo de realizar una petición a firebase para obtener las reservas y posteriormente imprimir la información de las reservas en las tablas.

    // En este caso, me subscribiré a un observador que se encontrará escuchando los cambios que se produzcan en una variable, que cargará la información de las propiedades que tenga el usuario.
    this._propiedadesService
      .getValue()
      .subscribe((data: PropiedadModelGet[]) => {
        this.array_id_propiedades = [];
        console.log(data);
        // La siguiente función se encargará de extraer el id y el nombre de la propiedad para poder buscar las reservaciones hechas a la misma.
        this.extraerIdPropiedades(data);
      });

    // A continuación me suscribiré a los cambios que se produzcan en el input select.
    // Si se selecciona una de las tantas propiedades, entonces se solicitará a firebase que traiga dicha información.
    this.propiedad_seleccionada.valueChanges.subscribe(
      (data: data_input_select) => {
        // console.log(data);

        this.reservas = [];
        this.reserva_bandera = true;

        // A continuación realizo una petición a firebase, enviandle el id de la propiedad, y la elección de reserva confirmada o sin confirmar.
        this._reservacionService
          .getReservasRecibidas(data.propiedad_id, parseInt(data.confirmada))
          .then((data: ReservarPropiedadModel[]) => {
            // Asigno la información que devuelva firebase al vector reservas.
            this.reservas = data;

            //Realizo algunas verificaciones para desplegar el cartel "No hay reservas"
            if (this.reservas.length == 0) {
              this.reserva_bandera = true;
            } else {
              this.reserva_bandera = false;
            }
            // console.log(data);
          });
      }
    );

    // Con las siguientes instrucciones me subscribo al evento valuesChanges del select, con el objetivo de enviar una petición a firebase para obtener las reservas ya sean confirmadas o no confirmadas
    this.reserva_seleccionada.valueChanges.subscribe((data) => {
      // console.log(data);
      // Solicito a firebase que me devuelve las reservas enviadas por los usuarios,  confirmadas o sin confirmar. Les envío el user_id del usuario actual logueado.
      this._reservacionService
        .getReservasEnviadas(
          localStorage.getItem('_u_ky'),
          parseInt(data.confirmada)
        )
        .then((data: ReservarPropiedadModel[]) => {
          // A continuación establezco en el vector reservas_enviadas la información de las reservas que devuelva firebase
          this.reservas_enviadas = data;

          if (this.reservas_enviadas.length == 0) {
            this.reserva_bandera_env = true;
          } else {
            this.reserva_bandera_env = false;
          }

          console.log('Propiedades reservadas por este usuario:', data);
        });
    });
  }

  ngOnDestroy(): void {}

  // En la siguiente función extraigo el id de la propiedad y el nombre de la misma, en primer lugar para enviarlo a firebase, y en segundo lugar, para posteriormente imprimirla en la tabla de reserva.
  extraerIdPropiedades(propiedades: PropiedadModelGet[]) {
    for (let i = 0; i < propiedades.length; i++) {
      // Añadiré un nuevo objeto al array de propiedades con el id y el nombre de cada una de las propiedades de los usuarios.
      this.array_id_propiedades.push({
        propiedad_id: propiedades[i].propiedad_id,
        nombre: propiedades[i].propiedad.nombre_propiedad,
      });
    }
  }

  confirmarReserva(id_reserva: string, index: number) {
    this._reservacionService.confirmarReservacion(id_reserva).then(() => {
      // A continuación elimino del vector de reservas la reserva que acabo de eliminar, con el objetivo de generar una "visualización de confirmación"
      this.reservas.splice(index, 1);

      console.log('La reserva se actualizó:');
    });
  }

  rechazarReserva(id_reserva: string, index: number) {
    this._reservacionService.rechazarReservacion(id_reserva).then(() => {
      // A continuación elimino del vector de reservas la reserva que acabo de eliminar, con el objetivo de generar una "visualización de eliminación"
      this.reservas.splice(index, 1);

      console.log('La reserva se rechazó y eliminó:');
    });
  }

  // La siguiente función creará los formularios para seleccionar reservaciones que ha recibido una propiedad.
  crearFormulario() {
    this.propiedad_seleccionada = this._formBuilder.group({
      propiedad_id: [''],
      confirmada: ['0'],
    });

    this.reserva_seleccionada = this._formBuilder.group({
      confirmada: [null],
    });
  }

  // La siguiente función se encargará de desplejar el cuadro de diálogo correspondiente a la tabla de precios
  openDialog(usuario_prop, tipo_usuario) {
    let array_fechas = [];

    this.dialog.open(DialogPropietarioComponent, {
      data: { ...usuario_prop, tipo_usuario: tipo_usuario },
    });
  }

  evaluarEstadoPago(pago: { payer: object; status: string }) {
    if (pago) {
      if (pago.status == 'approved') {
        return true;
      } else {
        return false;
      }
    }
  }
}
