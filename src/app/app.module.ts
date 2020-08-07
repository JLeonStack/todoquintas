import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Rutas
import { AppRoutingModule } from './app-routing.module';

// Http
import { HttpClientModule } from '@angular/common/http';

//Servicios
import { LugaresSearchUbicacionService } from './services/lugares-search-ubicacion.service';

// Componentes
import { AppComponent } from './app.component';

import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, PagesModule],
  // Aquí irán los componentes pertenecientes a los cuerpos de los cuadros de diálogos.
  entryComponents: [],

  // En providers van todos nuestros servicios
  providers: [LugaresSearchUbicacionService],

  bootstrap: [AppComponent],
})
export class AppModule {}
