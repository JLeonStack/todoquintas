import { Component, OnInit, Input } from '@angular/core';
import { CheckoutService } from '../../../services/checkout.service';

import { ReservarPropiedadMPModel } from '../../../models/reservar.model';
import { get } from 'scriptjs';

@Component({
  selector: 'app-mercadopago-button',
  templateUrl: './mercadopago-button.component.html',
  styleUrls: ['./mercadopago-button.component.css'],
})
export class MercadoPagoButtonComponent implements OnInit {
  init_point: any;

  @Input() propiedad: ReservarPropiedadMPModel;

  procesando = false;

  preference = {
    // Lugares a donde se redireccionará el pago si es correcto
    back_urls: {
      success: 'http://localhost:4200/process-payment',
      failure: 'http://localhost:4200/',
      pending: 'http://localhost:4200/',
    },
    auto_return: 'approved',
    // Solo permito pagar a usuarios registrado con MercadoPago
    // purpose: 'wallet_purchase',
    items: [
      {
        id: '1234', //id de la propiedad ha reservar
        title: 'La Ensoñada, Buenos Aires, Pilar',
        description: 'Inspired by the classic foldable art of origami',
        unit_price: 25000,
        currency_id: 'ARS',
        quantity: 1,
      },
    ],
    // A continuación excluyo la opción que se pueda pagar con efectivos
    payment_methods: {
      // excluded_payment_types: [
      //   {
      //     id: 'ticket',
      //   },
      // ],
      // La siguiente configuración setea la cantidad máximas de cuotas con las que se puede pagar.
      installments: 12,
    },
  };

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    if (this.propiedad) {
      // Almaceno distinta información en la preferencia correspondiente a la propiedad.
      if (this.propiedad.precio_reserva != null) {
        this.preference.items[0].unit_price = this.propiedad.precio_reserva;
      } else {
        this.preference.items[0].unit_price = this.propiedad.precio;
      }
      this.preference.items[0].title = this.propiedad.caracteristicas_propiedad.nombre_propiedad;
      this.preference.items[0].id = this.propiedad.id_reserva;
      this.preference.items[0].description = `Id Propiedad: ${this.propiedad.propiedad_id}\n Nombre Usuario: ${this.propiedad.huesped_info.nombre_huesped}\n User_id: ${this.propiedad.huesped_id}`;
    }
    get(
      'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js',
      () => {
        //library has been loaded...
      }
    );
  }

  // Función que se ejecutará una vez que se haga click en el botón
  onBuy() {
    this.procesando = true;
    this.checkoutService
      .goCheckOut(this.preference)
      .then((result) => {
        // Almaceno temporamente el id de la reserva que estoy intentando pagar, para posteriormente poder actualizar su documento en firebase y agregar información respecto a si la reserva ha sido pagada o no.
        localStorage.setItem('id-r', this.propiedad.id_reserva);

        // Read result of the Cloud Function.

        this.init_point = result.data.result;
        // console.log(this.init_point);

        // Redirreciono al link de mercadopago para abonar el pago.
        window.location.href = this.init_point;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }
}
