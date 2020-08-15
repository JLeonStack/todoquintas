import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  // Variable encargada de mostrar o ocultar el menú de filtros
  opened: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  cerrar($event){
    this.opened = $event;
  }
}
