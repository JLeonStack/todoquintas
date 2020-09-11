import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Servicios
import { ReservacionService } from '../../services/reservacion.service';

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.css'],
})
export class ProcessPaymentComponent implements OnInit {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private http: HttpClient,
    private _reservacionService: ReservacionService
  ) {}

  ngOnInit(): void {
    // Me suscribo a los parámetros query que vengan y procederé a almacenar en firebase, la confirmación de pago por parte del usuario a MercadoPago.
    this._activatedRoute.queryParams.subscribe((params) => {
      // Obtengo el id_pago, que es la colección que me devuelve mercadoPago
      let id_pago = params.collection_id;

      if (id_pago) {
        // Realizo una petición get a la api de mercadopago para obtener información del pago.
        this.http
          .get(
            `https://api.mercadopago.com/v1/payments/${id_pago}?access_token=TEST-6491746922952784-071316-58bf0220f4064459491baddf32ef0c23-608813922`
          )
          .subscribe((data: any) => {
            // Almaceno
            let id_reserva_pagada = localStorage.getItem('id-r');
            let info_pago_mp = {
              status: null,
              payer: null,
            };
            info_pago_mp.status = data.status;
            info_pago_mp.payer = data.payer;

            if (id_reserva_pagada) {
              this._reservacionService
                .agregarInfoPagoReserva(id_reserva_pagada, info_pago_mp)
                .then((data) => {
                  console.log('Se ha guardado la información de mercadopago');
                  localStorage.removeItem('id-r');
                  this._router.navigate(['/usuario']);
                });
              console.log(data);
            }
          });
      }
    });
  }
}
// 'https://api.mercadopago.com/checkout/preferences/608813922-6e52f342-3215-44af-bc09-1338127410e4?access_token=TEST-6491746922952784-071316-58bf0220f4064459491baddf32ef0c23-608813922'
