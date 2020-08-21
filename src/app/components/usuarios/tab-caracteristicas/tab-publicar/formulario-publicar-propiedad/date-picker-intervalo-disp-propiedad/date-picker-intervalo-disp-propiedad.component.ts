import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

// Con esta librería puedo capturar eventos del data picker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Importo el header que tendrá le datepicker
import { HeaderDatePickerIntervaloDispPropiedadComponent } from './header-date-picker-intervalo-disp-propiedad/header-date-picker-intervalo-disp-propiedad.component';

//Servicios
//Importo el servicio que controlará el limpiado del calendario
import { LimpiarFechasService } from '../../../../../../services/limpiar-fechas.service';

// Me subscribo al observable a la espera de cambios
import { Subscription } from 'rxjs';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-picker-intervalo-disp-propiedad',
  templateUrl: './date-picker-intervalo-disp-propiedad.component.html',
  styleUrls: ['./date-picker-intervalo-disp-propiedad.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ar' }],
})
export class DatePickerIntervaloDispPropiedadComponent
  implements OnInit, OnDestroy {
  @Output() prueba: EventEmitter<Object>;

  // @ViewChild('calendar') calendar: MatCalendar<Moment>;
  // selectedDate = new Date('2020/08/21');
  // Declaro una propiedad que contendrá el encabezado de nuestro calendario.
  headerDateRangePicker = HeaderDatePickerIntervaloDispPropiedadComponent;

  // Declaro dos propiedades que serán del tipo Date.
  minDate: Date;
  maxDate: Date;

  // Creo una propiedad que contendrá el año actual.
  currentYear = new Date().getFullYear();
  test: number;

  // La siguiente será una propiedad encargada de almacenar la subscripción al servicio para posteriormente poder dar de baja el mismo.
  fechaSubscripcion: Subscription;

  // Esta es el FromGroup encargado de capturar los valores del input daterangepicker.
  // Se definirirán dos controles del tipo FormControl que funcionarán para conservar los valores de inicio y fin en el date picker.
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Constructor
  // Declararé el servicio para poder utilizarlo
  constructor(private _limpiarFechaService: LimpiarFechasService) {
    this.prueba = new EventEmitter();

    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();

    // Establezco dos echas en las propiedades que declaré anteriormente. En este caso, la fecha mínima capaz de ser seleccionada es el día actual en adelante 6 meses aproximádamente.
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 4, 0);
  }

  ngOnInit(): void {
    // console.log(this.range.value.start);

    if (this.range.value.start != null) {
      // Establezco las fechas iniciales que pueden ser seleccionadas en el datapicker.
      this.minDate = new Date(this.range.value.start);
      this.maxDate = new Date(this.currentYear + 1, 4, 0);
    }

    this.range.valueChanges.subscribe((data) => {
      this.prueba.emit(data);
      // console.log(data);
    });

    // Me subscribo al evento que me permitirá limpiar las fechas del calendario
    this.fechaSubscripcion = this._limpiarFechaService.LimpiezaFecha$.subscribe(
      () => {
        // Cuando se detecte que se ha emitido un evento de borrar fechas se ejecutará el siguiente conjunto de instrucciones
        this.range.setValue({ start: null, end: null }); // Vacío la selección de fechas en los inputs

        // Establezco nuevamente las fechas mínimas y máximas que se puedan seleccionar
        this.minDate = new Date();
        this.maxDate = new Date(this.currentYear + 1, 4, 0);
        console.log('Observable Mensaje');
      }
    );
  }

  ngOnDestroy(): void {
    this.fechaSubscripcion.unsubscribe();
  }

  // Estas son las fechas que ya están reservadas
  datesReserved = [];

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
