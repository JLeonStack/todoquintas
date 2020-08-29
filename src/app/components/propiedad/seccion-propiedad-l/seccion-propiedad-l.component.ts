import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Servicio encargodo de devolverme las propiedades de firebase
import { PropiedadIndividualService } from '../../../services/propiedad-individual.service';

// Models
import { PropiedadModel } from '../../../models/propiedad.model';

import { ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
declare var $: any;

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

  caracteristicas_propiedad: PropiedadModel;

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

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.propiedadSubscription = this._propiedadIndividualService
        .getPropiedad(params['id'])
        .subscribe((data: any) => {
          // Obtengo las características de la propiedad
          this.caracteristicas_propiedad = data.data();
          console.log(this.caracteristicas_propiedad.propiedad.descripcion);
          console.log(data.data());
          setTimeout((ejecutar) => {
            this.iniciarCarousel();
          }, 3000);
        });
    });
  }

  ngOnDestroy(): void {
    this.propiedadSubscription.unsubscribe();
  }

  iniciarCarousel() {
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
}
