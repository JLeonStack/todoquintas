import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-propiedad-b',
  templateUrl: './tarjeta-propiedad-b.component.html',
  styleUrls: ['./tarjeta-propiedad-b.component.css'],
})
export class TarjetaPropiedadBComponent implements OnInit {
  @Input() propiedad;

  constructor() {}

  ngOnInit(): void {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  // La siguiente función retornará un color en caso de que no exista una piscina.
  colorClase(activado) {
    if (activado) {
      return '';
    } else {
      return '#CB3234';
    }
  }
}
