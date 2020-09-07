import { Component, OnInit, OnDestroy } from '@angular/core';

import { ReservacionService } from '../../../../services/reservacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-reservas',
  templateUrl: './tab-reservas.component.html',
  styleUrls: ['./tab-reservas.component.css'],
})
export class TabReservasComponent implements OnInit, OnDestroy {
  // El siguiente array almacenará las propiedades que tenga publicada el propietario
  array_id_propiedades = [];

  // En el siguiente array almacenaré las distintas fechas de reservaciones que se han hecho a las propiedades
  reservas = [];

  reservas_confirmadas = [];

  // Defino dos subscription, para posteriormente evitar que la conexión quede abierta, escuchando los cambios que se producen en la base de datos.
  obtenerPropiedadesSubscription: Subscription;
  obtenerReservasSubscription: Subscription;
  obtenerReservasConfirmadasSubscription: Subscription;

  constructor(private _reservacionService: ReservacionService) {}

  ngOnInit(): void {
    // En primer lugar, obtendré las propiedades del usuario para posteriormente extraer los id's, y los nombres de la mismas con el objetivo de realizar una petición a firebase para obtener las reservas y posteriormente imprimir la información de las reservas en las tablas.
    this.obtenerPropiedadesSubscription = this._reservacionService
      .getPropiedad()
      .subscribe((data) => {
        this.reservas = [];
        // console.log('Saber propiedades de las reservas:', data);

        // La siguiente función se encargará de extraer el id y el nombre de la propiedad para poder buscar las reservaciones hechas a la misma.
        this.extraerIdPropiedades(data);

        // Si el usuario tiene varias propiedades publicadas, será necesario que realice una petición para obtener las reservaciones de cada una de ellas.
        for (let i = 0; i < this.array_id_propiedades.length; i++) {
          console.log('ejecutando');
          // Ejecuto la función encargada de traerme las reservas hechas a cada una de las propiedades de los usuarios;
          this.obtenerReservasSubscription = this._reservacionService
            .getReservasRecibidas(this.array_id_propiedades[i], 0)
            .subscribe((data: any) => {
              console.log(data);
              this.reservas.push(...data);
            });
          // Ejecuto la función encargada de traerme las reservas hechas a cada una de las propiedades de los usuarios;
          this.obtenerReservasConfirmadasSubscription = this._reservacionService
            .getReservasRecibidas(this.array_id_propiedades[i], 1)
            .subscribe((data: any) => {
              console.log(data);
              this.reservas_confirmadas.push(...data);
            });

          // Me desuscribiré a la base de datos para evitar mantener una conexión abierta.
          if (i == this.array_id_propiedades.length) {
            console.log('Desuscribiendo');
            this.obtenerReservasSubscription.unsubscribe();
            this.obtenerReservasConfirmadasSubscription.unsubscribe();
          }
        }
        console.log(this.array_id_propiedades);

        // this.obtenerReservasSubscription.unsubscribe();

        // Me desuscribo de la petición a firebase de obtener las propiedades del propietario.
        this.obtenerPropiedadesSubscription.unsubscribe();
      });
  }

  ngOnDestroy(): void {
    this.obtenerReservasSubscription.unsubscribe();
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
    this.obtenerReservasSubscription.unsubscribe();
    this.obtenerReservasConfirmadasSubscription.unsubscribe();

    this._reservacionService.confirmarReservacion(id_reserva).then(() => {
      console.log('La reserva se actualizó:');
    });
  }

  rechazarReserva(id_reserva) {
    this.obtenerReservasSubscription.unsubscribe();
    this.obtenerReservasConfirmadasSubscription.unsubscribe();

    this._reservacionService.rechazarReservacion(id_reserva).then(() => {
      console.log('La reserva se rechazó y eliminó:');
    });
  }
}
