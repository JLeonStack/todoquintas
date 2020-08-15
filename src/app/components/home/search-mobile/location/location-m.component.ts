import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//services
import { LugaresSearchUbicacionService } from '../../../../services/lugares-search-ubicacion.service';

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
  constructor(
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService
  ) {}

  // Lifecycle
  ngOnInit(): void {
    // Me subscribo al evento valueChanges del input, para poder realizar las peticiones en base a los carácteres introducidos.
    this.myControl.valueChanges.subscribe((letra) => {
      if (letra != '') {
        this._lugaresSearchUbicacionService
          .obtenerLugar(letra)
          .subscribe((data: any) => {
            this.options = [];

            for (let index = 0; index < data.suggestions.length; index++) {
              this.options.push(data.suggestions[index].text);
            }
            // console.log(this.options);

            // Esto me permite indicar el autocomplete del input
            this.opcionesFiltradas = this.myControl.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
          });
      }
    });
  }

  // Función encargada de hacer el procesamiento de filtro
  private _filter(value: string): string[] {
    const valorFiltrado = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(valorFiltrado)
    );
  }
}
