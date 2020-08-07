import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './home/header/header.component';
import { SearchComponent } from './home/search/search.component';
import { LocationComponent } from './home/search/location/location.component';
import { LocationmComponent } from './home/search-mobile/location/location-m.component';
import { PropiedadComponent } from './home/search/propiedad/propiedad.component';
import { HuespedesComponent } from './home/search/huespedes/huespedes.component';
import { NavbarMobileComponent } from './shared/navbar-mobile/navbar-mobile.component';
import { SearchMobileComponent } from './home/search-mobile/search-mobile.component';
import { PropiedadDestacadasComponent } from './home/propiedad-destacadas/propiedad-destacadas.component';
import { TarjetaCarouselComponent } from './home/propiedad-destacadas/tarjeta-carousel/tarjeta-carousel.component';
import { TerminosCondicionesComponent } from './shared/footer/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from './shared/footer/politica-privacidad/politica-privacidad.component';
import { NumberSpinnerComponent } from './shared/filtros/number-spinner/number-spinner.component';
import { SidenavComponent } from './listing-homes/sidenav/sidenav.component';
import { ListadoCasasBusquedaComponent } from './listing-homes/listado-casas-busqueda/listado-casas-busqueda.component';
import { TarjetaPropiedadBComponent } from './listing-homes/listado-casas-busqueda/tarjeta-propiedad-b/tarjeta-propiedad-b.component';
import { HeaderListadoCComponent } from './listing-homes/header-listado-c/header-listado-c.component';
import { FiltrosSidenavComponent } from './listing-homes/sidenav/filtros-sidenav/filtros-sidenav.component';
import { SelectPropiedadFComponent } from './listing-homes/sidenav/filtros-sidenav/select-propiedad-f/select-propiedad-f.component';
import { PCarousellMainComponent } from './propiedad/seccion-propiedad-l/p-carousell-main/p-carousell-main.component';
import { ReservationDialogComponent } from './propiedad/reservation-dialog/reservation-dialog.component';
import { DatePickerReservaComponent } from './propiedad/reservation-dialog/date-picker-reserva/date-picker-reserva.component';
import { PropiedadDetallesListComponent } from './propiedad/seccion-propiedad-l/propiedad-detalles-list/propiedad-detalles-list.component';
import { CarouselPropiedadDetallesListComponent } from './propiedad/seccion-propiedad-l/carousel-propiedad-detalles-list/carousel-propiedad-detalles-list.component';

import { SeccionPropiedadLComponent } from './propiedad/seccion-propiedad-l/seccion-propiedad-l.component';
import { PropiedadesRelacionadasComponent } from './propiedad/seccion-propiedad-l/propiedades-relacionadas/propiedades-relacionadas.component';
import { CarouselPropiedadServiciosComponent } from './propiedad/seccion-propiedad-l/carousel-propiedad-servicios/carousel-propiedad-servicios.component';
import { NavbarEPropComponent } from './shared/navbar-e-prop/navbar-e-prop.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
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
    NumberSpinnerComponent,
    SidenavComponent,
    ListadoCasasBusquedaComponent,
    TarjetaPropiedadBComponent,
    HeaderListadoCComponent,
    FiltrosSidenavComponent,
    SelectPropiedadFComponent,
    PCarousellMainComponent,
    ReservationDialogComponent,
    DatePickerReservaComponent,
    PropiedadDetallesListComponent,
    CarouselPropiedadDetallesListComponent,
    SeccionPropiedadLComponent,
    PropiedadesRelacionadasComponent,
    CarouselPropiedadServiciosComponent,
    NavbarEPropComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
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
    NumberSpinnerComponent,
    SidenavComponent,
    ListadoCasasBusquedaComponent,
    TarjetaPropiedadBComponent,
    HeaderListadoCComponent,
    FiltrosSidenavComponent,
    SelectPropiedadFComponent,
    PCarousellMainComponent,
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
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
  ],
  // Aquí irán los componentes pertenecientes a los cuerpos de los cuadros de diálogos.
  entryComponents: [TerminosCondicionesComponent, PoliticaPrivacidadComponent],
})
export class ComponentsModule {}
