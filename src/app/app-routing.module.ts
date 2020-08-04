import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importo las distintas vistas
import { HomeComponent } from './components/home/home.component';
import { ListingHomesComponent } from './components/listing-homes/listing-homes.component';
import { PropiedadPageComponent } from './components/propiedad/propiedad-page.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'busqueda', component: ListingHomesComponent },
  { path: 'propiedad', component: PropiedadPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
