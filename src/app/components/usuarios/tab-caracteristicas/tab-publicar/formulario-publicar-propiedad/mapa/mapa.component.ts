import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';

// Servicio Georef
import { GeorefArgService } from '../../../../../../services/georef-arg.service';

// Me subscribo al observable a la espera de cambios
import { Subscription } from 'rxjs';

// Declaro una variable para poder utilizar la librerías que traigo por CDN
declare var L: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private _GeorefArgService: GeorefArgService) {}

  coordenadas = [-34.599149, -58.383826];

  map;

  coordeanadasSubscripcion: Subscription;

  contador = 0;

  // myEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.coordeanadasSubscripcion = this._GeorefArgService.AsignarCoordenadas$.subscribe(
      (data: any) => {
        setTimeout(() => {
          if (this.contador != 0) {
            this.map.remove();
          }
          this.coordenadas = data;
          this.map = L.map('mapid').setView(this.coordenadas, 10);
          this.iniciarMapa(this.map);
          this.contador++;
        }, 1000);
      }
    );
  }

  ngOnDestroy(): void {
    this.coordeanadasSubscripcion.unsubscribe();
    this.contador = 0;
  }

  ngAfterViewInit(): void {
    // En la propiedad map, crearé un nuevo mapa en el identificador "mapid"
    // this.map = L.map('mapid').setView(this.coordenadas, 10);
    // Ejecuto la función iniciarMapa para definir las características el mapa.
    // this.iniciarMapa(this.map);
  }

  private initMap(): void {
    var mymap = L.map('mapid').setView([-34.599149, -58.383826], 15);
    L.marker([-34.599149, -58.383826]).addTo(mymap);

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVib25tYWxvbiIsImEiOiJjanZvMmRuaGIxdTRtNDRxcmJmcXVkZDl4In0.KX_zj5RVkp3pL5HKeckvEA',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoiZGVib25tYWxvbiIsImEiOiJjanZvMmRuaGIxdTRtNDRxcmJmcXVkZDl4In0.KX_zj5RVkp3pL5HKeckvEA',
      }
    ).addTo(mymap);

    mymap.on('click', function (e) {
      console.log(e);
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
      // alert(e.latlng);
    });
  }

  // Función encargada de gestionar los puntos que se indican en el mapa
  private iniciarMapa(map): void {
    // Initialize the map and assign it to a variable for later use
    // map = L.map('mapid').setView(this.coordenadas, 10);

    L.control.scale().addTo(map);

    // Create a Tile Layer and add it to the map
    //var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVib25tYWxvbiIsImEiOiJjanZvMmRuaGIxdTRtNDRxcmJmcXVkZDl4In0.KX_zj5RVkp3pL5HKeckvEA',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoiZGVib25tYWxvbiIsImEiOiJjanZvMmRuaGIxdTRtNDRxcmJmcXVkZDl4In0.KX_zj5RVkp3pL5HKeckvEA',
      }
    ).addTo(map);

    // Parte crucial. * Esta línea costó conseguirla. Es esencial para que se muestre el contro lde búsqueda en el mapa.
    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

    var results = new L.LayerGroup().addTo(map);

    // Declaro una variable donde almacenaré el marker que se establezca en el mapa ya sea a través del buscador o hacer click en alguna sección del mapa.
    var marker;

    // console.log(searchControl);

    searchControl.on('results', function (data) {
      results.clearLayers();

      console.log(data);

      // Emitiré un evento para ser capaz de pasar las coordenadas fuera de la función.
      myEvent.emit(data.latlng);

      for (var i = data.results.length - 1; i >= 0; i--) {
        // Si hay algún elemento en el marker, lo eliminaré.
        if (marker != undefined) {
          map.removeLayer(marker);
        }
        // Agrego las nuevas coordeandas al marker  para después mostrarla en el mapa
        marker = L.marker(data.results[i].latlng);
        results.addLayer(marker);
      }
    });

    // ! El siguiente eventEmitter se encargará de escuchar los cambios de coordenas cuando el usuario haga click en el mapa y realice un marker.
    var myEvent = new EventEmitter<string>();

    // Me subscribo al evento
    myEvent.subscribe((data) => {
      // Una vez que el usuario ha hecho click en algún lugar del mapa, lo que haré será emitir un evento pasando los datos de las cordenadas que indican el punto que el usuario ha marcado
      this._GeorefArgService.RecogerCoordenadas$.emit(data); // En el componente formulario-publicar capturaré este evento para posteriormente añadirlo al formGroup.
    });

    // El siguiente evento se encaargará de escuchar los clicks que el usuario realiza sobre el mapa.
    map.on('click', function (e) {
      console.log(e);

      // Emitiré un evento para ser capaz de pasar las coordenadas fuera de la función.
      myEvent.emit(e.latlng);

      // Si hay algún elemento en el marker, lo eliminaré.
      if (marker != undefined) {
        map.removeLayer(marker);
      }
      // L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      marker = new L.Marker(e.latlng, { draggable: true });
      map.addLayer(marker);
    });
  }
}
