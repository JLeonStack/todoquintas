import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

// Servicios
import { ReservacionService } from '../../../../services/reservacion.service';
import { DialogPropietarioComponent } from './dialog-propietario/dialog-propietario.component';

import { MatDialog } from '@angular/material/dialog';

import { Subscription, Subscriber, Observable } from 'rxjs';

// Interfaces
interface data_input_select {
  id_propiedad: string;
  confirmada: string;
}

interface Reserva {
  confirmada: number;
  fechas_reservadas: { start: string; end: string };
  id_reserva: string;
  personas_hospedar: number;
  precio: number;
  propiedad_id: string;
  usuario: string;
  info_huesped: object;
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

  reservas_enviadas = [];
  reserva_bandera_env = true;

  // En el siguiente array almacenaré las distintas fechas de reservaciones que se han hecho a las propiedades
  reservas = [];
  reserva_bandera = true;

  // Defino dos subscription, para posteriormente evitar que la conexión quede abierta, escuchando los cambios que se producen en la base de datos.
  obtenerPropiedadesSubscription: Subscription;
  obtenerReservasSubscription: Subscription;
  obtenerReservasEnviadas: Subscription;

  constructor(
    private _reservacionService: ReservacionService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.crearFormulario();

    // A continuación me suscribiré a los cambios que se produzcan en el input select.
    // Si se selecciona una de las tantas propiedades, entonces se solicitará a firebase que traiga dicha información.
    this.propiedad_seleccionada.valueChanges.subscribe(
      (data: data_input_select) => {
        this.obtenerReservasSubscription = this._reservacionService
          .getReservasRecibidas(data.id_propiedad, parseInt(data.confirmada))
          .subscribe((data: Reserva[]) => {
            console.log(data);
            this.reservas = data;

            if (this.reservas.length == 0) {
              this.reserva_bandera = true;
            } else {
              this.reserva_bandera = false;
            }
          });
        console.log(data);
      }
    );

    // Con las siguientes instrucciones me subscribo al evento valuesChanges del select, con el objetivo de enviar una petición a firebase para obtener las reservas ya sean confirmadas o no confirmadas
    this.reserva_seleccionada.valueChanges.subscribe((data) => {
      // Solicito a firebase que me devuelve las reservas enviadas por los usuarios,  confirmadas o sin confirmar
      this.obtenerReservasEnviadas = this._reservacionService
        .getReservasEnviadas(
          localStorage.getItem('_u_ky'),
          parseInt(data.confirmada)
        )
        .subscribe((data) => {
          this.reservas_enviadas = data;

          if (this.reservas_enviadas.length == 0) {
            this.reserva_bandera_env = true;
          } else {
            this.reserva_bandera_env = false;
          }
          console.log('Propiedades reservadas por este usuario:', data);
        });
    });
    // En primer lugar, obtendré las propiedades del usuario para posteriormente extraer los id's, y los nombres de la mismas con el objetivo de realizar una petición a firebase para obtener las reservas y posteriormente imprimir la información de las reservas en las tablas.
    this.obtenerPropiedadesSubscription = this._reservacionService
      .getPropiedad()
      .subscribe((data) => {
        this.reservas = [];
        // console.log('Saber propiedades de las reservas:', data);

        // La siguiente función se encargará de extraer el id y el nombre de la propiedad para poder buscar las reservaciones hechas a la misma.
        this.extraerIdPropiedades(data);

        // Me desuscribo de la petición a firebase de obtener las propiedades del propietario.
        this.obtenerPropiedadesSubscription.unsubscribe();
      });
  }

  ngOnDestroy(): void {
    this.obtenerPropiedadesSubscription.unsubscribe();
  }

  // En la siguiente función extraigo el id de la propiedad y el nombre de la misma, en primer lugar para enviarlo a firebase, y en segundo lugar, para posteriormente imprimirla en la tabla de reserva.
  extraerIdPropiedades(propiedades) {
    for (let i = 0; i < propiedades.length; i++) {
      // Añadiré un nuevo objeto al array de propiedades con el id y el nombre de cada una de las propiedades de los usuarios.
      this.array_id_propiedades.push({
        id_propiedad: propiedades[i].id_prop,
        nombre: propiedades[i].propiedad.nombre_propiedad,
      });
    }
  }

  confirmarReserva(id_reserva) {
    this._reservacionService.confirmarReservacion(id_reserva).then(() => {
      console.log('La reserva se actualizó:');
    });
  }

  rechazarReserva(id_reserva) {
    this._reservacionService.rechazarReservacion(id_reserva).then(() => {
      console.log('La reserva se rechazó y eliminó:');
    });
  }

  crearFormulario() {
    this.propiedad_seleccionada = this._formBuilder.group({
      id_propiedad: [''],
      confirmada: ['0'],
    });

    this.reserva_seleccionada = this._formBuilder.group({
      confirmada: [null],
    });
  }

  // La siguiente función se encargará de desplejar el cuadro de diálogo correspondiente a la tabla de precios
  openDialog(usuario_prop) {
    let array_fechas = [];

    this.dialog.open(DialogPropietarioComponent, {
      data: [`${usuario_prop}`],
    });
  }
}
