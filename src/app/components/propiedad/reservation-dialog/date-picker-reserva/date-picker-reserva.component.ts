import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

// Con esta librería puedo capturar eventos del data picker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Importo el header que tendrá le datepicker
import { HeaderDateRangePicker } from './header-date-picker-range/header-date-picker-range.component';

//Servicios
//Importo el servicio que controlará el limpiado del calendario
import { LimpiarFechasService } from '../../../../services/limpiar-fechas.service';
import { ReservacionService } from '../../../../services/reservacion.service';

import { ActivatedRoute, Router } from '@angular/router';

// Me subscribo al observable a la espera de cambios
import { Subscription } from 'rxjs';

import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-date-picker-reserva',
  templateUrl: './date-picker-reserva.component.html',
  styleUrls: ['./date-picker-reserva.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ar' }],
})
export class DatePickerReservaComponent
  implements OnInit, OnDestroy, OnChanges {
  // En el siguiente input, yo recibo las fechas min-max capaces de ser seleccionadas en el datepicker.
  @Input() nuevo_max_min_firebase;

  @Output() intervalo_seleccinado: EventEmitter<Object>;

  // A continuación almaceno el header del datepicker para posteriormente pasarlo como propiedad al mat-date-range-picker
  headerDateRangePicker = HeaderDateRangePicker;

  // Establezco dos propiedades que serán del tipo Date, encargadas de gestionar las fechas máximas y mínimas del datepicker
  minDate: Date;
  maxDate: Date;

  currentYear = new Date().getFullYear();
  test: number;

  fechaSubscripcion: Subscription;

  // El siguiente es el array que almacenará las fechas en formato yy-mm-dd
  array_fechas = [];

  // El siguiente es el array con las fechas en formato JSON.
  array_fechas_json = [];

  // Esta es el FromGroup encargado de capturar los valores del input daterangepicker.
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Constructor
  constructor(
    private _limpiarFechaService: LimpiarFechasService,
    private _reservacionService: ReservacionService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.intervalo_seleccinado = new EventEmitter();
  }

  // Cuando detecte que se ha pasado información al componente datepicker desde reservation-dialog, procederé a establecer las fechas min-max del datepicker.
  ngOnChanges(changes: SimpleChanges) {
    // Compruebo si existe algún dato en la propiedad del input
    if (this.nuevo_max_min_firebase) {
      // Si es así, quiere decir que he recibido información actualizada en el input

      console.log('DatePicker Fechas:', this.nuevo_max_min_firebase.fechas);

      // Creo una variable tempeoral, la cual servirá para establecer el minDate
      /* Para esto multiplicaré la información proveniente del input, que está en segunos, a milisegundos, para establecer la fecha correcta a setear.*/
      let nuevoMinDate_firebase = new Date(
        this.nuevo_max_min_firebase.fechas[0].start.seconds * 1000
      );

      // Propiedad temporal donde almacenaré la fecha actual.
      let actual_minDate = new Date();

      // A continuación evaluaré si la fecha mínima capaz de ser seleccionada es menor a la actual.
      /* Si esto es así, lo que haré será setear como minDate la fecha actual, para evitar que se reserven día anteriores al día de hoy.*/
      if (nuevoMinDate_firebase <= actual_minDate) {
        this.minDate = actual_minDate;
      } else {
        // Seteo las fechas posibles de seleccionar en base a lo que el usuario decide
        this.minDate = nuevoMinDate_firebase;
      }

      // A continuación lo que haré será configurar la fecha máxima. Para esto, le pasaré la úiltima fecha que se encuentre en el array de fechas.
      this.maxDate = new Date(
        this.nuevo_max_min_firebase.fechas[
          this.nuevo_max_min_firebase.fechas.length - 1
        ].end.seconds * 1000
      );

      // console.log(this.maxDate);
    }
  }

  ngOnInit(): void {
    // console.log(this.range.value.start);
    if (this.range.value.start != null) {
      // Establezco las fechas iniciales que pueden ser seleccionadas en el datapicker.
      this.minDate = new Date(this.range.value.start);
      this.maxDate = new Date(this.currentYear + 1, 4, 0);
    }

    // Me subscribo al evento que me permitirá limpiar las fechas del calendario
    this.fechaSubscripcion = this._limpiarFechaService.LimpiezaFecha$.subscribe(
      () => {
        // Cuando se detecte que se ha emitido un evento de borrar fechas se ejecutará el siguiente conjunto de instrucciones
        this.range.setValue({ start: null, end: null }); // Vacío la selección de fechas en los inputs

        // Establezco nuevamente las fechas mínimas y máximas que se puedan seleccionar
        this.minDate = new Date();

        // Establecezco la fecha máxima capaz de ser seleccionada.
        this.maxDate = new Date(
          this.nuevo_max_min_firebase.fechas[
            this.nuevo_max_min_firebase.fechas.length - 1
          ].end.seconds * 1000
        );
      }
    );

    // Me subscribo a los cambios que se vayan a producir en el datepicker con el objetivo de transmitir al componente padre la inforormación y almacenarla en el FormGroup
    this.range.valueChanges.subscribe((data) => {
      this.intervalo_seleccinado.emit(data);
    });

    // Obtengo el id de la propiedad a través de la información que proviene de la url para colocarla en el formgroup de reservación.
    this._activatedRoute.params.subscribe((params) => {
      this._reservacionService.getReservas(params['id']).subscribe((data) => {
        console.log('Data de firebase: Datepicker ', data);
        for (let i = 0; i < data.length; i++) {
          this.calcularRangoEntreFechas(data[i]);
        }
        console.log(this.array_fechas_json);
      });
    });
  }

  // La siguiente función se encargará de tomar el intervalo de fechas que ha seleccionado el usuario, y desestructurarlo en un array con todas las fechas que componen este intervalo. Es decir:
  /* Si el usuario selecciona: 1-09-2020 hasta 20-09-2020, el array estará comprendido por cada una de las fechas entre ese intervalo, incluyendo los extremos. */
  calcularRangoEntreFechas(fechas_reservadas) {
    /* Tomaré la fecha inicial selecciona por el usuario, que proviene en formato JSON, y la convertiré en formato string, para posteriormente poder utilizar los métodos de un objeto Date. */
    let newDate = new Date(
      fechas_reservadas.fechas_reservadas.start
    ).toString();

    /* Proceso a convertir ahora la fecha final seleccionada por el usuario. */
    let newDateEnd = new Date(
      fechas_reservadas.fechas_reservadas.end
    ).toString();

    // Formateo la fecha obtenida para que ahora sea del tipo Date.
    let newDate_2 = new Date(newDate);
    let newDateEnd_2 = new Date(newDateEnd);

    // Fabrico una fecha inciial en el formato yy-mm-dd
    let fecha_inicio = `${newDate_2.getFullYear()}/${
      newDate_2.getMonth() + 1
    }/${newDate_2.getDate()}`;
    // console.log(fecha_inicio);

    // Fabrico una fecha final en el formato yy-mm-dd
    let fecha_final = `${newDateEnd_2.getFullYear()}/${
      newDateEnd_2.getMonth() + 1
    }/${newDateEnd_2.getDate()}`;

    // console.log(fecha_final);

    // Establezco una nueva fecha inicial, y final, para poder generar el array con las fechas comprendidas entre ese intervalo
    var fechaInicio = new Date(fecha_inicio);
    var fechaFin = new Date(fecha_final);

    // Mientras la fecha final sea mayor a la fecha inicial, procederé a ejecutar el ciclo while
    while (fechaFin.getTime() >= fechaInicio.getTime()) {
      this.array_fechas.push(
        `${
          fechaInicio.getFullYear() +
          '/' +
          (fechaInicio.getMonth() + 1) +
          '/' +
          fechaInicio.getDate()
        }`
      );
      // Agregaré un elemento al array de fechas en formato yy-mm-dd

      fechaInicio.setDate(fechaInicio.getDate() + 1);
    }

    /* A continuación lo que haré será recorrer todo el array de fechas en formato yy-mm-dd y paso a convertirlas en formato JSON: 2020-09-08T03:00:00.000Z */

    for (let i = 0; i < this.array_fechas.length; i++) {
      this.array_fechas_json[i] = JSON.parse(
        JSON.stringify(new Date(this.array_fechas[i]))
      );
    }
  }

  ngOnDestroy(): void {
    this.fechaSubscripcion.unsubscribe();
  }

  Filtrado: (date: Date | null) => boolean = (date: Date | null) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
    //0 means sunday
    //6 means saturday
  };

  // Estas son las fechas que ya están reservadas. Este array vendrá de un servicio.
  // datesReserved = [
  //   '2020-09-03T03:00:00.000Z',
  //   '2020-09-05T03:00:00.000Z',
  //   '2020-09-08T03:00:00.000Z',
  // ];

  datesReserved = this.array_fechas_json;

  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);

    // console.log(event.value);
    // Establezco las fechas mínimas y máximas que se pueden seleccionar en base a la fecha inicial que se haya seleccionado.
    this.minDate = new Date(event.value); // Cuando el usuario decida seleccionar una fecha como punto de partida, impediré que seleccione fechas hacia atrás.

    // console.log(this.range.value.start);
    // console.log(new Date(this.datesReserved[0]));

    // Recorreré cada una de las fechas indicadas como "ocupadas", y procederé a que se impida seleccionar fechas por encima de éstas.
    for (let index = 0; index < this.datesReserved.length; index++) {
      if (this.range.value.start < new Date(this.datesReserved[index])) {
        // Estableceré cómo máxima fecha posible de reservación la que
        // this.maxDate = new Date(this.datesReserved[index]);
        // Obtengo el tiempo en milisegundos
        this.test = new Date(this.datesReserved[index]).getTime();
        // Le resto un día al tiempo obtenido para que el maxDate sea hasta (sin incluir), la fecha reservada
        this.maxDate = new Date(this.test - 86400000);
        // Cuando se encuentre una coincidencia de que la fecha seleccionada es menor a una de las fechas ya reservadas anteriormente, procederé a romper el ciclo, para que quede seteado el MaxDate, con la primera fecha encontrada.
        break;
      }
    }
  }

  // Esta función se encarga de resaltar las fechas que ya han sido reservadas
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesReserved
        .map((strDate) => new Date(strDate))
        .some(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );

      return highlightDate ? 'example-custom-date-class' : '';
    };
  }
}
