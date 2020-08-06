import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

// Con esta librería puedo capturar eventos del data picker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-picker-reserva',
  templateUrl: './date-picker-reserva.component.html',
  styleUrls: ['./date-picker-reserva.component.css'],
})
export class DatePickerReservaComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  currentYear = new Date().getFullYear();

  constructor() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 4, 0);
    console.log(this.range.value);
  }

  ngOnInit(): void {
    // console.log(this.range.value.start);
    if (this.range.value.start != null) {
      // Establezco las fechas iniciales que pueden ser seleccionadas en el datapicker.
      this.minDate = new Date(this.range.value.start);
      this.maxDate = new Date(this.currentYear + 1, 4, 0);
    }
  }

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  Filtrado: (date: Date | null) => boolean = (date: Date | null) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
    //0 means sunday
    //6 means saturday
  };

  // Estas son las fechas que ya están reservadas
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
        this.maxDate = new Date(this.datesReserved[index]);
      }
    }
  }

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
  // dateClass = (d: Date): MatCalendarCellCssClasses => {
  //   const date = d.getDate();

  //   // Highlight the 1st and 20th day of each month.
  //   return date === 1 || date === 20 ? 'example-custom-date-class' : '';
  // };
}
