// El siguiente archivo se encarga de importar y manejar los módulos de Angular Material
import { NgModule } from '@angular/core';

// Componentes
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
  ], //Vamos a darle los módulos que queremos importar
  exports: [
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
  ], //Modulos que queremos exportar
  providers: [],
})
export class MaterialModule {}
