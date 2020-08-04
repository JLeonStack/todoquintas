import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker-reserva',
  templateUrl: './date-picker-reserva.component.html',
  styleUrls: ['./date-picker-reserva.component.css'],
})
export class DatePickerReservaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  title = 'angular10-date-picker';

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
}
