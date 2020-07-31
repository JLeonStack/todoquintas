// El siguiente archivo se encarga de importar y manejar los módulos de Angular Material
import { NgModule } from '@angular/core';

// Componentes
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule
  ], // Vamos a darle los módulos que queremos importar desde las librerías
  exports: [
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ], //Modulos que queremos exportar para que puedan ser utilizados en todo el programa
  providers: [],
})
export class MaterialModule {}
