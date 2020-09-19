import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() ciudad_provincia_ubicacion: string;

  // Variable encargada de mostrar o ocultar el menú de filtros
  opened: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  cerrar($event: any) {
    this.opened = $event;
  }
}
