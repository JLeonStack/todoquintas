import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './home/header/header.component';
import { SearchComponent } from './home/search/search.component';
import { LocationmComponent } from './home/search-mobile/location/location-m.component';
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

import { ReservationDialogComponent } from './propiedad/reservation-dialog/reservation-dialog.component';
import { DatePickerReservaComponent } from './propiedad/reservation-dialog/date-picker-reserva/date-picker-reserva.component';
import { PropiedadDetallesListComponent } from './propiedad/seccion-propiedad-l/propiedad-detalles-list/propiedad-detalles-list.component';

import { SeccionPropiedadLComponent } from './propiedad/seccion-propiedad-l/seccion-propiedad-l.component';
import { PropiedadesRelacionadasComponent } from './propiedad/seccion-propiedad-l/propiedades-relacionadas/propiedades-relacionadas.component';

import { NavbarEPropComponent } from './shared/navbar-e-prop/navbar-e-prop.component';

import { PropiedadServiciosListComponent } from './propiedad/seccion-propiedad-l/propiedad-servicios-list/propiedad-servicios-list.component';
import { NavbarEPropMobileComponent } from './shared/navbar-e-prop-mobile/navbar-e-prop-mobile.component';
import { MapaComponent } from './usuarios/tab-caracteristicas/tab-publicar/formulario-publicar-propiedad/mapa/mapa.component';
import { TabCaracteristicasComponent } from './usuarios/tab-caracteristicas/tab-caracteristicas.component';
import { CardFavoritoUserComponent } from './usuarios/tab-caracteristicas/card-favorito-user/card-favorito-user.component';
import { TabPublicarComponent } from './usuarios/tab-caracteristicas/tab-publicar/tab-publicar.component';
import { FormularioPublicarPropiedadComponent } from './usuarios/tab-caracteristicas/tab-publicar/formulario-publicar-propiedad/formulario-publicar-propiedad.component';
import { DatePickerIntervaloDispPropiedadComponent } from './usuarios/tab-caracteristicas/tab-publicar/formulario-publicar-propiedad/date-picker-intervalo-disp-propiedad/date-picker-intervalo-disp-propiedad.component';
import { HeaderDatePickerIntervaloDispPropiedadComponent } from './usuarios/tab-caracteristicas/tab-publicar/formulario-publicar-propiedad/date-picker-intervalo-disp-propiedad/header-date-picker-intervalo-disp-propiedad/header-date-picker-intervalo-disp-propiedad.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Drag & Drop Image
import { NgxDropzoneModule } from 'ngx-dropzone';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from '../app-routing.module';
import { TabFavoritosComponent } from './usuarios/tab-caracteristicas/tab-favoritos/tab-favoritos.component';
import { TabPropiedadesComponent } from './usuarios/tab-caracteristicas/tab-propiedades/tab-propiedades.component';
import { TabReservasComponent } from './usuarios/tab-caracteristicas/tab-reservas/tab-reservas.component';
import { TabDatosUsuarioComponent } from './usuarios/tab-caracteristicas/tab-datos-usuario/tab-datos-usuario.component';
import { DialogPrecioComponent } from './propiedad/reservation-dialog/dialog-precio/dialog-precio.component';
import { MercadoPagoButtonComponent } from './shared/mercadopago-button/mercadopago-button.component';
import { DialogPropietarioComponent } from './usuarios/tab-caracteristicas/tab-reservas/dialog-propietario/dialog-propietario.component';
import { ChatComponent } from './usuarios/tab-caracteristicas/tab-reservas/chat/chat.component';
import { PropiedadesNuevasComponent } from './home/propiedades-nuevas/propiedades-nuevas.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    SearchComponent,
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
    ReservationDialogComponent,
    DatePickerReservaComponent,
    PropiedadDetallesListComponent,
    SeccionPropiedadLComponent,
    PropiedadesRelacionadasComponent,
    NavbarEPropComponent,
    PropiedadServiciosListComponent,
    NavbarEPropMobileComponent,
    MapaComponent,
    TabCaracteristicasComponent,
    CardFavoritoUserComponent,
    TabPublicarComponent,
    FormularioPublicarPropiedadComponent,
    DatePickerIntervaloDispPropiedadComponent,
    HeaderDatePickerIntervaloDispPropiedadComponent,
    TabFavoritosComponent,
    TabPropiedadesComponent,
    TabReservasComponent,
    TabDatosUsuarioComponent,
    DialogPrecioComponent,
    MercadoPagoButtonComponent,
    DialogPropietarioComponent,
    ChatComponent,
    PropiedadesNuevasComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    SearchComponent,
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
    ReservationDialogComponent,
    DatePickerReservaComponent,
    PropiedadDetallesListComponent,
    SeccionPropiedadLComponent,
    PropiedadesRelacionadasComponent,
    NavbarEPropComponent,
    NavbarEPropMobileComponent,
    TabCaracteristicasComponent,
    CardFavoritoUserComponent,
    TabPublicarComponent,
    FormularioPublicarPropiedadComponent,
    DatePickerIntervaloDispPropiedadComponent,
    HeaderDatePickerIntervaloDispPropiedadComponent,
    TabFavoritosComponent,
    TabPropiedadesComponent,
    TabReservasComponent,
    TabDatosUsuarioComponent,
    DialogPrecioComponent,
    MercadoPagoButtonComponent,
    DialogPropietarioComponent,
    ChatComponent,
    PropiedadesNuevasComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    NgxDropzoneModule,
    InfiniteScrollModule,
  ],
  // Aquí irán los componentes pertenecientes a los cuerpos de los cuadros de diálogos.
  entryComponents: [TerminosCondicionesComponent, PoliticaPrivacidadComponent],
})
export class ComponentsModule {}
