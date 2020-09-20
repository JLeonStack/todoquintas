import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//services
import { LugaresSearchUbicacionService } from '../../../services/lugares-search-ubicacion.service';

// Rutas
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.css'],
})
export class SearchMobileComponent implements OnInit {
  // Opciones de lugares que serán desplegados en el input cuando el usuario teclee la información en el fórmulario de ubicación
  options: string[] = [];

  public search_form: FormGroup;
  myControl = new FormControl();

  // Observador
  opcionesFiltradas: Observable<string[]>;

  // Constructor.
  constructor(
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

  // Lifecycle
  ngOnInit(): void {
    this.crearFormulario();
    // Me subscribo al evento valueChanges del input, para poder realizar las peticiones en base a los carácteres introducidos.
    this.search_form.get('ubicacion').valueChanges.subscribe((letra) => {
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
      this.search_form.get('ubicacion').setValue('');
    }
  }

  crearFormulario() {
    this.search_form = this._fb.group({
      ubicacion: ['', Validators.required],
      huespedes: ['1', Validators.required],
      propiedad: ['cualquiera', Validators.required],
    });
  }

  // Con la siguiente función retorno el control que gestionará el input mat-autocomplete de ubicación en la versión móvil
  obtenerControl() {
    return this.search_form.get('ubicacion');
  }

  // Función encargada de hacer el procesamiento de filtro
  private _filter(value: string): string[] {
    const valorFiltrado = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(valorFiltrado)
    );
  }
}
