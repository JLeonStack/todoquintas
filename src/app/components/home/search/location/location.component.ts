import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Serviviocs
import { LugaresSearchUbicacionService } from '../../../../services/lugares-search-ubicacion.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  options: string[] = [];

  myControl = new FormControl();

  opcionesFiltradas: Observable<string[]>;

  // Constructor.
  constructor(
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService
  ) {}

  // Lifecycle
  ngOnInit(): void {
    // Cuando detecte cambios en el form-control procederé a solicitar una petición a la API REST con el objetivo de devolver las sugerencias en base a las letras introducidas
    this.myControl.valueChanges.subscribe((letra) => {
      if (letra != '') {
        this._lugaresSearchUbicacionService
          .obtenerLugar(letra)
          .subscribe((data: any) => {
            // console.log(data);
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

// Filtrado sin http
// Lifecycle
// ngOnInit(): void {
//   this.opcionesFiltradas = this.myControl.valueChanges.pipe(
//     startWith(''),
//     map((value) => this._filter(value))
//   );
// }

// // Función encargada de hacer el procesamiento de filtro
// private _filter(value: string): string[] {
//   const valorFiltrado = value.toLowerCase();
//   return this.options.filter((option) =>
//     option.toLowerCase().includes(valorFiltrado)
//   );
// }
