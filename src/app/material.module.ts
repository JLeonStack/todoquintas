// El siguiente archivo se encarga de importar y manejar los módulos de Angular Material
import { NgModule } from '@angular/core';

// Componentes
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [],
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,
  ], // Vamos a darle los módulos que queremos importar desde las librerías
  exports: [
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,
  ], //Modulos que queremos exportar para que puedan ser utilizados en todo el programa
  providers: [],
})
export class MaterialModule {}
