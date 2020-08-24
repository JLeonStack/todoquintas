import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
} from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';

import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

// Con esta librería puedo capturar eventos del data picker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Importo el header que tendrá le datepicker
import { HeaderDatePickerIntervaloDispPropiedadComponent } from './header-date-picker-intervalo-disp-propiedad/header-date-picker-intervalo-disp-propiedad.component';

// Me subscribo al observable a la espera de cambios
import { Subscription } from 'rxjs';

import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-date-picker-intervalo-disp-propiedad',
  templateUrl: './date-picker-intervalo-disp-propiedad.component.html',
  styleUrls: ['./date-picker-intervalo-disp-propiedad.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ar' }],
})
export class DatePickerIntervaloDispPropiedadComponent
  implements OnInit, OnDestroy, OnChanges {
  // El siguiente output es definido para ser capaz de pasar al componente padre el rango de fechas seleccionado por el usuario, con el objetivo de que sean almacenado en el FormGroup.
  @Output() recogerFechaEvent: EventEmitter<Object>;

  @Input() public nuevoMinDate: any;

  // Declaro una propiedad que contendrá el encabezado de nuestro calendario.
  headerDateRangePicker = HeaderDatePickerIntervaloDispPropiedadComponent;

  // Declaro dos propiedades que serán del tipo Date.
  minDate: Date;
  maxDate: Date;

  // Variable encargada de establecer una nueva fecha
  test: number;

  // Esta es el FromGroup encargado de capturar los valores del input daterangepicker.
  // Se definirirán dos controles del tipo FormControl que funcionarán para conservar los valores de inicio y fin en el date picker.
  range: FormGroup;

  // Constructor
  // Declararé el servicio para poder utilizarlo
  constructor(private _formBuilder: FormBuilder) {
    this.recogerFechaEvent = new EventEmitter();

    // Ejecuto el método que se encarga se configurar las fechas mínimas y máximas que admite el calendario
    this.establecerFechasIniciales();
  }

  ngOnInit(): void {
    console.log(this.nuevoMinDate);
  }

  // La siguiente función establece las fechas iniciales mínimas y máximas capaces de ser seleccionadas en el datepicker en un comienzo.
  establecerFechasIniciales() {
    // Creo el formulario encargado de controlar los valores start y end
    this.range = this._formBuilder.group({
      start: [null, { updateOn: 'change' }],
      end: [null, { updateOn: 'change' }],
    });

    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();

    // Establezco dos echas en las propiedades que declaré anteriormente. En este caso, la fecha mínima capaz de ser seleccionada es el día actual en adelante 6 meses aproximádamente.
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 4, 0);
  }

  restablecer = {
    start: null,
    end: null,
  };

  // El siguiente método se ejecutará cuando el usuario le haga click al botón de reiniciar fechas.
  restablecerFechas() {
    console.log('click');

    if (this.restablecer['start'] != null) {
      console.log(this.restablecer);

      this.minDate = this.restablecer.start;
      console.log(this.minDate);
      var nuevoMinDate = new Date(this.minDate).getTime();

      this.range.setValue({ start: null, end: null });

      this.minDate = new Date(nuevoMinDate);

      console.log('Restablecer');
    }
  }

  // La siguiente función se encargará de ejecutarse cuando el usuario decida seleccionar una fecha de partida en el calendario
  startDateMethod($event) {
    // En la variable $event recibiré el input con cada una de las características correspondientes al mismo.

    // Crearé una variable objeto a la cual le asignaré el valor que posea el input startdate.
    let objeto = {
      data: $event.value,
      valor: 'start',
    };
    /* Dicho objeto tendrá el siguiente formato:
    {data: Mon Aug 24 2020 00:00:00 GMT-0300 (hora estándar de Argentina), valor: "start"} */

    // A continuación asignaré en la variable restablecer el valor proveniente del input
    this.restablecer['start'] = $event.value;

    // Emitiré un evento hacia el componente padre, en este caso formulario-publicar.
    this.recogerFechaEvent.emit(objeto);
  }

  // La siguiente función se encargará de ejecutarse cuando el usuario decida seleccionar una fecha final en el calendario
  endDateMethod($event) {
    // En la variable $event recibiré el input con cada una de las características correspondientes al mismo.

    // Crearé una variable objeto a la cual le asignaré el valor que posea el input startdate.
    let objeto = {
      data: $event.value,
      valor: 'end',
    };

    /* El objeto tendrá el siguiente valor
    {data: Wed Aug 26 2020 00:00:00 GMT-0300 (hora estándar de Argentina), valor: "end"} 
    */

    this.restablecer['end'] = $event.value;

    // Emitiré un evento hacia el componente padre, en este caso, formulario-publicar.
    this.recogerFechaEvent.emit(objeto);
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'nuevoMinDate': {
            if (this.nuevoMinDate['end'] != null && this.nuevoMinDate['end']) {
              if (this.nuevoMinDate['reset'] == 0) {
                this.minDate = this.nuevoMinDate['end'];
                var nuevoMinDate = new Date(this.minDate).getTime();
                this.minDate = new Date(nuevoMinDate + 86400000);
              }
              // console.log(this.minDate);
            }
          }
        }
      }
    }
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
