import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
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
  @Input() nuevo_max_min_firebase;

  headerDateRangePicker = HeaderDateRangePicker;

  minDate: Date;
  maxDate: Date;
  currentYear = new Date().getFullYear();
  test: number;

  fechaSubscripcion: Subscription;

  // Esta es el FromGroup encargado de capturar los valores del input daterangepicker.
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Constructor
  constructor(private _limpiarFechaService: LimpiarFechasService) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 4, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Compruebo si existe algún dato en la propiedad del input
    if (this.nuevo_max_min_firebase) {
      // Si es así, quiere decir que he recibido información actualizada en el input
      console.log('DatePicker:', this.nuevo_max_min_firebase.fechas);
      let nuevoMinDate_firebase = new Date(
        this.nuevo_max_min_firebase.fechas[0].start.seconds * 1000
      );

      let actual_minDate = new Date();
      if (nuevoMinDate_firebase <= actual_minDate) {
        this.minDate = actual_minDate;
      } else {
        // Seteo las fechas posibles de seleccionar en base a lo que el usuario decide
        this.minDate = nuevoMinDate_firebase;
      }

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
        this.maxDate = new Date(
          this.nuevo_max_min_firebase.fechas[
            this.nuevo_max_min_firebase.fechas.length - 1
          ].end.seconds * 1000
        );
        console.log('Observable Mensaje');
      }
    );
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
  datesReserved = [
    '2020-08-23T03:00:00.000Z',
    '2020-08-21T03:00:00.000Z',
    '2020-08-18T03:00:00.000Z',
  ];

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
