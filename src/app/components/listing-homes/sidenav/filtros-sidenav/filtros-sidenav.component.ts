import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtros-sidenav',
  templateUrl: './filtros-sidenav.component.html',
  styleUrls: ['./filtros-sidenav.component.css'],
})
export class FiltrosSidenavComponent implements OnInit {
  @Output() cerrarSidenav: EventEmitter<boolean>;
  constructor() {
    this.cerrarSidenav = new EventEmitter();
  }


  ngOnInit(): void {}

  aplicarFiltro()
  {
    console.log("Evento emitido");
    this.cerrarSidenav.emit(false);
  }
}
