import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Guard
import { AuthGuard } from './services/auth.guard';

// Importo las distintas vistas
import { HomeComponent } from './pages/home/home.component';
import { ListingHomesComponent } from './pages/listing-homes/listing-homes.component';
import { PropiedadPageComponent } from './pages/propiedad/propiedad-page.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },

  { path: 'busqueda', component: ListingHomesComponent },

  // La siguiente ruta, de propiedad recibirá un parámetro id, que será la propiedad en la que el usuario querrá obtener más detalles
  { path: 'propiedad/:id', component: PropiedadPageComponent },

  // Rutas donde se mostrará la información del usuario, y la capacidad de publicar o seguir la reserva de una propiedad
  { path: 'usuario', component: UsuariosComponent, canActivate: [AuthGuard] },

  // Cualquier otro par me redirecciona al home.
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
