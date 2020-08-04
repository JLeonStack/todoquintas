import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Layout
import { LayoutModule } from '@angular/cdk/layout';

// Rutas
import { AppRoutingModule } from './app-routing.module';

//Servicios
import { LugaresSearchUbicacionService } from './services/lugares-search-ubicacion.service';

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

// Componentes
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/home/header/header.component';
import { SearchComponent } from './components/home/search/search.component';
import { LocationComponent } from './components/home/search/location/location.component';
import { LocationmComponent } from './components/home/search-mobile/location/location-m.component';
import { PropiedadComponent } from './components/home/search/propiedad/propiedad.component';
import { HuespedesComponent } from './components/home/search/huespedes/huespedes.component';
import { NavbarMobileComponent } from './components/shared/navbar-mobile/navbar-mobile.component';
import { SearchMobileComponent } from './components/home/search-mobile/search-mobile.component';
import { PropiedadDestacadasComponent } from './components/home/propiedad-destacadas/propiedad-destacadas.component';
import { TarjetaCarouselComponent } from './components/home/propiedad-destacadas/tarjeta-carousel/tarjeta-carousel.component';
import { TerminosCondicionesComponent } from './components/shared/footer/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from './components/shared/footer/politica-privacidad/politica-privacidad.component';
import { ListingHomesComponent } from './components/listing-homes/listing-homes.component';
import { NumberSpinnerComponent } from './components/shared/filtros/number-spinner/number-spinner.component';
import { SidenavComponent } from './components/listing-homes/sidenav/sidenav.component';
import { ListadoCasasBusquedaComponent } from './components/listing-homes/listado-casas-busqueda/listado-casas-busqueda.component';
import { TarjetaPropiedadBComponent } from './components/listing-homes/listado-casas-busqueda/tarjeta-propiedad-b/tarjeta-propiedad-b.component';
import { HeaderListadoCComponent } from './components/listing-homes/header-listado-c/header-listado-c.component';
import { FiltrosSidenavComponent } from './components/listing-homes/sidenav/filtros-sidenav/filtros-sidenav.component';
import { SelectPropiedadFComponent } from './components/listing-homes/sidenav/filtros-sidenav/select-propiedad-f/select-propiedad-f.component';
import { PropiedadPageComponent } from './components/propiedad/propiedad-page.component';
import { PCarousellMainComponent } from './components/propiedad/seccion-propiedad-l/p-carousell-main/p-carousell-main.component';
import { ReservationDialogComponent } from './components/propiedad/reservation-dialog/reservation-dialog.component';
import { DatePickerReservaComponent } from './components/propiedad/reservation-dialog/date-picker-reserva/date-picker-reserva.component';
import { PropiedadDetallesListComponent } from './components/propiedad/seccion-propiedad-l/propiedad-detalles-list/propiedad-detalles-list.component';
import { CarouselPropiedadDetallesListComponent } from './components/propiedad/seccion-propiedad-l/carousel-propiedad-detalles-list/carousel-propiedad-detalles-list.component';

import { SeccionPropiedadLComponent } from './components/propiedad/seccion-propiedad-l/seccion-propiedad-l.component';
import { PropiedadesRelacionadasComponent } from './components/propiedad/seccion-propiedad-l/propiedades-relacionadas/propiedades-relacionadas.component';
import { CarouselPropiedadServiciosComponent } from './components/propiedad/seccion-propiedad-l/carousel-propiedad-servicios/carousel-propiedad-servicios.component';
import { NavbarEPropComponent } from './components/shared/navbar-e-prop/navbar-e-prop.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    HeaderComponent,
    SearchComponent,
    LocationComponent,
    PropiedadComponent,
    HuespedesComponent,
    NavbarMobileComponent,
    SearchMobileComponent,
    LocationmComponent,
    PropiedadDestacadasComponent,
    TarjetaCarouselComponent,
    TerminosCondicionesComponent,
    PoliticaPrivacidadComponent,
    ListingHomesComponent,
    NumberSpinnerComponent,
    SidenavComponent,
    ListadoCasasBusquedaComponent,
    TarjetaPropiedadBComponent,
    HeaderListadoCComponent,
    FiltrosSidenavComponent,
    SelectPropiedadFComponent,
    PCarousellMainComponent,
    PropiedadPageComponent,
    ReservationDialogComponent,
    DatePickerReservaComponent,
    PropiedadDetallesListComponent,
    CarouselPropiedadDetallesListComponent,
    SeccionPropiedadLComponent,
    PropiedadesRelacionadasComponent,
    CarouselPropiedadServiciosComponent,
    NavbarEPropComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
  ],
  // Aquí irán los componentes pertenecientes a los cuerpos de los cuadros de diálogos.
  entryComponents: [TerminosCondicionesComponent, PoliticaPrivacidadComponent],

  // En providers van todos nuestros servicios
  providers: [LugaresSearchUbicacionService],

  bootstrap: [AppComponent],
})
export class AppModule {}
