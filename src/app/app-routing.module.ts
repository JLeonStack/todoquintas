import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importo las distintas vistas
import { HomeComponent } from './components/home/home.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
