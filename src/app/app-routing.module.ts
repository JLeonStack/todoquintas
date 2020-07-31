import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importo las distintas vistas
import { HomeComponent } from './components/home/home.component';
import { ListingHomesComponent } from './components/listing-homes/listing-homes.component';


const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'busqueda', component: ListingHomesComponent},
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
