import { Component, OnInit } from '@angular/core';

// Librerias encargadas de gestionar los formularios
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// Servicios
import { LugaresSearchUbicacionService } from '../../../services/lugares-search-ubicacion.service';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Rutas
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  public search_form: FormGroup;

  public options: string[] = [];

  public opcionesFiltradas: Observable<string[]>;

  constructor(
    private _fb: FormBuilder,
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Seteo el formulario.
    this.crearFormulario();
    // Cuando detecte cambios en el form-control procederé a solicitar una petición a la API REST con el objetivo de devolver las sugerencias en base a las letras introducidas
    this.search_form.get('ubicacion').valueChanges.subscribe((letra) => {
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
            this.opcionesFiltradas = this.search_form
              .get('ubicacion')
              .valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          });
      }
    });
  }

  realizarBusqueda() {
    console.log(this.search_form.value);
    if (this.search_form.valid) {
      this._router.navigate(['/busqueda'], {
        queryParams: {
          ubicacion: this.search_form.get('ubicacion').value,
          huespedes: this.search_form.get('huespedes').value,
          propiedad: this.search_form.get('propiedad').value,
        },
      });
    }
  }

  // Función encargada de crear el formulario para poder realizar la búsqueda.
  crearFormulario() {
    this.search_form = this._fb.group({
      ubicacion: ['', Validators.required],
      huespedes: ['1', Validators.required],
      propiedad: ['cualquiera', Validators.required],
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
