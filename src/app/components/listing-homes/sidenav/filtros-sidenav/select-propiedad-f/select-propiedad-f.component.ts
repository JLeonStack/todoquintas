import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-propiedad-f',
  templateUrl: './select-propiedad-f.component.html',
  styleUrls: ['./select-propiedad-f.component.css'],
})
export class SelectPropiedadFComponent implements OnInit {
  disableSelect = new FormControl(false);

  constructor() {}

  ngOnInit(): void {}
}
