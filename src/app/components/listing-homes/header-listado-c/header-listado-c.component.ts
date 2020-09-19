import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-listado-c',
  templateUrl: './header-listado-c.component.html',
  styleUrls: ['./header-listado-c.component.css'],
})
export class HeaderListadoCComponent implements OnInit {
  @Input() provincia_buscada: string;

  constructor() {}

  ngOnInit(): void {}
}
