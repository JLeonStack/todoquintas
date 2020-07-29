import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Layout
import { LayoutModule } from '@angular/cdk/layout';

// Rutas
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/home/header/header.component';
import { SearchComponent } from './components/home/search/search.component';
import { LocationComponent } from './components/home/search/location/location.component';
import { PropiedadComponent } from './components/home/search/propiedad/propiedad.component';
import { HuespedesComponent } from './components/home/search/huespedes/huespedes.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NavbarMobileComponent } from './components/shared/navbar-mobile/navbar-mobile.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
