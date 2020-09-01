import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-propiedad-detalles-list',
  templateUrl: './propiedad-detalles-list.component.html',
  styleUrls: ['./propiedad-detalles-list.component.css'],
})
export class PropiedadDetallesListComponent implements OnInit, OnChanges {
  @Input() detalles_propiedad;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.detalles_propiedad) {
      this.detalles_propiedad = this.detalles_propiedad.propiedad;
    }
  }
  colorClase(activado) {
    if (activado) {
      return '';
    } else {
      return '#CB3234';
    }
  }
}
