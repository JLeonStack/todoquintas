import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-huespedes',
  templateUrl: './huespedes.component.html',
  styleUrls: ['./huespedes.component.css'],
})
export class HuespedesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  disableSelect = new FormControl(false);
}
