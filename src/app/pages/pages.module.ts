import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Componentes
import { ComponentsModule } from '../components/components.module';

// Páginas
import { HomeComponent } from './home/home.component';
import { ListingHomesComponent } from './listing-homes/listing-homes.component';
import { PropiedadPageComponent } from './propiedad/propiedad-page.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    HomeComponent,
    ListingHomesComponent,
    PropiedadPageComponent,
    UsuariosComponent,
  ],
  imports: [CommonModule, ComponentsModule, MatTabsModule],
})
export class PagesModule {}

// AIzaSyA1qk7oYpnrXurif080Zcfg7ffoZCidZB
