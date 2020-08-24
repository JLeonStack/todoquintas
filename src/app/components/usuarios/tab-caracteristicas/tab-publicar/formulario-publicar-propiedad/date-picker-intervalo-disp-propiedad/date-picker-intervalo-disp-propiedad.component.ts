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
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';

import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

// Con esta librería puedo capturar eventos del data picker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Importo el header que tendrá le datepicker
import { HeaderDatePickerIntervaloDispPropiedadComponent } from './header-date-picker-intervalo-disp-propiedad/header-date-picker-intervalo-disp-propiedad.component';

//Servicios
//Importo el servicio que controlará el limpiado del calendario
import { LimpiarFechasService } from '../../../../../../services/limpiar-fechas.service';

// Me subscribo al observable a la espera de cambios
import { Subscription, Observable } from 'rxjs';

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

  // @ViewChild('calendar') calendar: MatCalendar<Moment>;
  // selectedDate = new Date('2020/08/21');
  // Declaro una propiedad que contendrá el encabezado de nuestro calendario.
  headerDateRangePicker = HeaderDatePickerIntervaloDispPropiedadComponent;

  // Declaro dos propiedades que serán del tipo Date.
  minDate: Date;
  maxDate: Date;

  // Creo una propiedad que contendrá el año actual.
  currentYear = new Date().getFullYear();

  // Variable encargada de estwablecer una nueva fecha
  test: number;

  // La siguiente será una propiedad encargada de almacenar la subscripción al servicio para posteriormente poder dar de baja el mismo.
  fechaSubscripcion: Subscription;

  // Esta es el FromGroup encargado de capturar los valores del input daterangepicker.
  // Se definirirán dos controles del tipo FormControl que funcionarán para conservar los valores de inicio y fin en el date picker.
  range: FormGroup;

  // Constructor
  // Declararé el servicio para poder utilizarlo
  constructor(
    private _limpiarFechaService: LimpiarFechasService,
    private _formBuilder: FormBuilder
  ) {
    this.recogerFechaEvent = new EventEmitter();

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

  ngOnInit(): void {
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
        this.maxDate = new Date(this.currentYear + 1, 4, 0);
        // console.log('Observable Mensaje');
      }
    );
  }

  restablecer = {
    start: null,
    end: null,
  };

  restablecerFechas() {
    console.log('click');
    console.log(this.restablecer);
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
  endDateMethod($event) {
    let objeto = {
      data: $event.value,
      valor: 'end',
    };
    this.restablecer['end'] = $event.value;

    this.recogerFechaEvent.emit(objeto);
  }

  ngOnDestroy(): void {
    this.fechaSubscripcion.unsubscribe();
  }

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
