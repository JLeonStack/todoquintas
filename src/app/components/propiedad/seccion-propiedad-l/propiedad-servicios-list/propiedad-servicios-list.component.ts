import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-propiedad-servicios-list',
  templateUrl: './propiedad-servicios-list.component.html',
  styleUrls: ['./propiedad-servicios-list.component.css'],
})
export class PropiedadServiciosListComponent implements OnInit, OnChanges {
  @Input() detalles_propiedad;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.detalles_propiedad) {
      this.detalles_propiedad = this.detalles_propiedad.propiedad;
      console.log('Estos son los servicios:', this.detalles_propiedad);
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
