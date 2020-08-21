import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { AppRoutingModule } from './app-routing.module';

//Formularios
import { ReactiveFormsModule } from '@angular/forms';

// Http
import { HttpClientModule } from '@angular/common/http';

//Servicios
import { LugaresSearchUbicacionService } from './services/lugares-search-ubicacion.service';

import { AuthService } from './services/auth.service';

import { GeorefArgService } from './services/georef-arg.service';

// Componentes
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';

// PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  // Aquí irán los componentes pertenecientes a los cuerpos de los cuadros de diálogos.
  entryComponents: [],

  // En providers van todos nuestros servicios
  providers: [LugaresSearchUbicacionService, AuthService, GeorefArgService],

  bootstrap: [AppComponent],
})
export class AppModule {}
