import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// Imports para el filtro
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  options: string[] = ['Pilar', 'Mar del plata', 'CABA'];

  myControl = new FormControl();

  opcionesFiltradas: Observable<string[]>;

  // Lifecycle
  ngOnInit(): void {
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
