import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

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
    console.log(this.range.value.start);
    if (this.range.value.start != null) {
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

  datesToHighlight = [
    '2020-08-22',
    '2020-08-24',
    '2020-08-28',
    '2020-08-24',
    '2020-08-23',
    '2020-08-22',
    '2020-08-25',
  ];

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
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
