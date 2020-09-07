import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CheckoutService } from '../../../services/checkout.service';

import { get } from 'scriptjs';

@Component({
  selector: 'app-mercadopago-button',
  templateUrl: './mercadopago-button.component.html',
  styleUrls: ['./mercadopago-button.component.scss'],
})
export class MercadoPagoButtonComponent implements OnInit {
  init_point: any;

  preference = {
    // Lugares a donde se redireccionará el pago si es correcto
    back_urls: {
      success: 'http://localhost:4200/usuario',
      failure: 'http://localhost:4200/',
      pending: 'http://localhost:4200/',
    },
    auto_return: 'approved',
    // Solo permito pagar a usuarios registrado con MercadoPago
    purpose: 'wallet_purchase',
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
      excluded_payment_types: [
        {
          id: 'ticket',
        },
      ],
      // La siguiente configuración setea la cantidad máximas de cuotas con las que se puede pagar.
      installments: 12,
    },
  };

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    get(
      'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js',
      () => {
        //library has been loaded...
      }
    );
  }

  // Función que se ejecutará una vez que se haga click en el botón
  onBuy() {
    this.checkoutService
      .goCheckOut(this.preference)
      .then((result) => {
        // Read result of the Cloud Function.
        this.init_point = result.data.result;
        console.log(this.init_point);
        window.location.href = this.init_point;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }
}
