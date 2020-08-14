import { Component, OnInit, AfterViewInit } from '@angular/core';

// Declaro una variable para poder utilizar la librerías que traigo por CDN
declare var L: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // this.initMap();
    this.iniciarMapa();
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
  private iniciarMapa(): void {
    // Initialize the map and assign it to a variable for later use

    var map = L.map('mapid').setView([-34.599149, -58.383826], 10);

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

    searchControl.on('results', function (data) {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        if (marker != undefined) {
          map.removeLayer(marker);
        }
        marker = L.marker(data.results[i].latlng);
        results.addLayer(marker);
      }
    });

    map.on('click', function (e) {
      console.log(e);
      if (marker != undefined) {
        map.removeLayer(marker);
      }
      // L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      marker = new L.Marker(e.latlng, { draggable: true });
      map.addLayer(marker);
    });
  }
}
