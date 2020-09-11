import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Servicio encargodo de devolverme las propiedades de firebase
import { PropiedadIndividualService } from '../../../services/propiedad-individual.service';

// Models
import { PropiedadModel } from '../../../models/propiedad.model';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-seccion-propiedad-l',
  templateUrl: './seccion-propiedad-l.component.html',
  styleUrls: ['./seccion-propiedad-l.component.css'],
})
export class SeccionPropiedadLComponent implements OnInit, OnDestroy {
  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop: boolean;
  navbar_mobile: boolean;

  propiedadSubscription: Subscription;
  user_infoSubscription: Subscription;

  caracteristicas_propiedad: PropiedadModel;
  user_info;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla.
  constructor(
    private _observer: BreakpointObserver,
    private _propiedadIndividualService: PropiedadIndividualService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._observer.observe('(min-width: 768px)').subscribe((result) => {
      if (result.matches) {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      } else {
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      }
    });
  }

  // La siguiente propiedad almacenará las imágenes que provengan de la base de datos.
  imagenes_fireb = [];
  detalles_propiedad;

  ngOnInit(): void {
    // Me subscribo a los parámetros que provengan de la url.
    this._activatedRoute.params.subscribe((params) => {
      // Realizo una petición a la base de datos, enviándo el id de la propiedad para recibir toda la información asociada a la misma.
      this.propiedadSubscription = this._propiedadIndividualService
        .getPropiedad(params['id'])
        .subscribe((data: any) => {
          // Obtengo las características de la propiedad
          this.caracteristicas_propiedad = data.data();
          console.log(data.data());
          localStorage.setItem(
            '_u_ky_p',
            this.caracteristicas_propiedad.user_p
          );

          // Almacenaré en la propiedad, las imágenes provenientes de la base de datos.
          this.imagenes_fireb = this.caracteristicas_propiedad.img_f;
          this.detalles_propiedad = this.caracteristicas_propiedad.propiedad;

          console.log(this.detalles_propiedad);

          // Con las siguientes instrucciones realizo una petición a firebase obteniendo la información del usuario
          this.user_infoSubscription = this._propiedadIndividualService
            .getUserInfo(this.caracteristicas_propiedad.user_p)
            .subscribe((user_info) => {
              this.user_info = user_info.data();
            });

          // Un segundo luego de recibida la información procederé a iniciar el carousel, de esta manera evito
          setTimeout(() => {
            // Inicio el carousel principal
            this.iniciarCarousel();
            this.iniciarCarouselDetallesPropiedad();
            this.iniciarCarouselServiciosPropiedad();
            this.initMap();
          }, 1000);
        });
    });
  }

  ngOnDestroy(): void {
    this.propiedadSubscription.unsubscribe();
    this.user_infoSubscription.unsubscribe();
    localStorage.removeItem('_u_ky_p');
  }

  iniciarCarousel() {
    var window_w = $(window).innerWidth();

    $('.gallery')
      .find('.gallery-item')
      .each(function () {
        var pi_height1 = $(this).outerWidth(true),
          pi_height2 = pi_height1 / 2;

        if ($(this).hasClass('grid-long') && window_w > 991) {
          $(this).css('height', pi_height2);
        } else {
          $(this).css('height', Math.abs(pi_height1));
        }
      });

    $('.gallery').masonry({
      itemSelector: '.gallery-item',
      columnWidth: '.grid-sizer',
      gutter: 20,
    });

    /*------------------
			Review Slider
		--------------------*/
    $('.review-slider').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      items: 1,
      dots: false,
      autoplay: true,
    });

    $('.clients-slider').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 30,
      nav: false,
      dots: false,
      responsive: {
        0: {
          items: 2,
          margin: 10,
        },
        600: {
          items: 3,
        },
        800: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
    });

    /*------------------
			Review Slider
		--------------------*/
    var sync1 = $('#sl-slider');
    var sync2 = $('#sl-slider-thumb');
    var slidesPerPage = 4; //globaly define number of elements per page
    var syncedSecondary = true;

    sync1
      .owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: true,
        dots: true,
        loop: true,
        lazyLoad: true,
        responsiveRefreshRate: 200,
      })
      .on('changed.owl.carousel', syncPosition);

    sync2
      .on('initialized.owl.carousel', function () {
        sync2.find('.owl-item').eq(0).addClass('current');
      })
      .owlCarousel({
        items: slidesPerPage,
        dots: true,
        nav: true,
        margin: 10,
        lazyLoad: true,
        smartSpeed: 200,
        slideSpeed: 500,
        navText: [
          '<i class="fa fa-angle-left"></i>',
          '<i class="fa fa-angle-right"></i>',
        ],
        slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
        responsiveRefreshRate: 100,
      })
      .on('changed.owl.carousel', syncPosition2);

    function syncPosition(el) {
      //if you set loop to false, you have to restore this next line
      //var current = el.item.index;
      //if you disable loop you have to comment this block
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }

      //end block
      sync2
        .find('.owl-item')
        .removeClass('current')
        .eq(current)
        .addClass('current');
      var onscreen = sync2.find('.owl-item.active').length - 1;
      var start = sync2.find('.owl-item.active').first().index();
      var end = sync2.find('.owl-item.active').last().index();

      if (current > end) {
        sync2.data('owl.carousel').to(current, 100, true);
      }
      if (current < start) {
        sync2.data('owl.carousel').to(current - onscreen, 100, true);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        sync1.data('owl.carousel').to(number, 100, true);
      }
    }

    sync2.on('click', '.owl-item', function (e) {
      e.preventDefault();
      var number = $(this).index();
      sync1.data('owl.carousel').to(number, 300, true);
    });
  }

  iniciarCarouselDetallesPropiedad() {
    // Carousel estinado a mostrar las características de las propiedades en la versión móvil
    $('.owl-carousel.seccion-propiedades').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 3,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
    });
  }

  colorClase(activado) {
    if (activado) {
      return '';
    } else {
      return '#CB3234';
    }
  }

  recortarNombre(nombre: string) {
    let nombre_u = nombre.split(' ');
    return nombre_u[0];
  }

  iniciarCarouselServiciosPropiedad() {
    // Carousel estinado a mostrar los servicios de las propiedades
    $('.owl-carousel.seccion-servicios').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 3,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
    });
  }

  private initMap(): void {
    var mymap = L.map('mapid2').setView(
      [
        this.detalles_propiedad.coordenadas.lat,
        this.detalles_propiedad.coordenadas.lng,
      ],
      13
    );
    L.marker([
      this.detalles_propiedad.coordenadas.lat,
      this.detalles_propiedad.coordenadas.lng,
    ]).addTo(mymap);

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
  }
}
