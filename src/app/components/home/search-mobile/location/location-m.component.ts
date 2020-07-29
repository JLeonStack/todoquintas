import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//services
import {LugaresSearchUbicacionService} from '../../../../services/lugares-search-ubicacion.service';

@Component({
  selector: 'app-location-m',
  templateUrl: './location-m.component.html',
  styleUrls: ['./location-m.component.css'],
})
export class LocationmComponent implements OnInit {
  
  // Opciones de lugares que serán desplegados en el input cuando el usuario teclee la información en el fórmulario de ubicación
  options: string[] = [];

  myControl = new FormControl();

  // Observador
  opcionesFiltradas: Observable<string[]>;

  // Constructor.
  constructor( private _lugaresSearchUbicacionService: LugaresSearchUbicacionService)
  {}

  // Lifecycle
  ngOnInit(): void {

    // Llenaré el vector de options con las ubicaciones provenientes del servicio.
    this.options = this._lugaresSearchUbicacionService.getLugares();
    console.log(this.options);
    // Función para filtrar las propiedades
    this.opcionesFiltradas = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

  }

  // Función encargada de hacer el procesamiento de filtro
  private _filter(value: string): string[] {
    const valorFiltrado = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(valorFiltrado)
    );
  }
}
