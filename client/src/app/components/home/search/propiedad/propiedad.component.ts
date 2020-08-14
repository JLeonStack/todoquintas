import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-propiedad',
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.css'],
})
export class PropiedadComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  disableSelect = new FormControl(false);
}
