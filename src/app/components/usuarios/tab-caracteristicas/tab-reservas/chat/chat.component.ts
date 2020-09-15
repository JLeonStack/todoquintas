import { Component, OnInit, Input } from '@angular/core';

// Servicios
import { ChatService } from '../../../../../services/chat-message.service';

// Rxjs
import { Observable } from 'rxjs';

// Modelos
import { ReservarPropiedadMPcModel } from '../../../../../models/reservar.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  // Obtengo información de la reserva que envío desde el componente Dialog-propietario
  @Input() reserva: ReservarPropiedadMPcModel;

  // La siguiente propiedad sirve para capturar la información del input "mensaje" del caht
  mensaje: string = '';

  // La siguiente propiedade será un observable, que recibirá información del chat proveniente de firebase, y posteriormente, a través de un pipe async mostraré en el html la información del chat.
  public chat$: Observable<any>;

  // La siguiente propiead capturará el div del chat, para desplazar el sroll a la parte final
  public elemento: any;

  // Capturo el usuario actual logueado
  public user_login = localStorage.getItem('_u_ky');

  // A continuación almacenaré el tipo de usuario que está intentando pedir información sobre la otra parte. Por ejemplo, si se indica "propietario" -> quiere decir que debo imprimir información del huesped, y viceversa
  public tipo_usuario;

  constructor(public _chatService: ChatService) {}

  ngOnInit(): void {
    // Compruebo si la reserva tiene un id_chat asociado, en caso de que no lo tenga crearé uno y lo almacenaré en la reserva.
    if (this.reserva.id_chat) {
      // A continuación obtengo la información del chat y la almaceno en una constante source. Recibiré un observable
      const source = this._chatService.get(this.reserva.id_chat);

      this.chat$ = source;

      // Me suscribo al observable para poder setear el scrol
      source.subscribe(() => {
        // Realizo un setTimeOut para poder llevar hasta abajo el scroll
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20);
      });
    } else {
      // Si la reserva no tieene un chat_id, entonces crearé uno y almacenaré el mismo en la reserva.
      this._chatService.create(this.reserva);
    }

    // Hago referencia al elemento chat para posteriormente controlar el scroll.
    this.elemento = document.getElementById('app-mensajes');
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  // La siguiente función se encarga de enviar a firebase el nuevo mensaje.
  enviar_mensaje() {
    // Le enviaré el id_chat en el cual debe guardar los mensajes, el mensaje, y el id del usuario que lo ha eviado
    this._chatService.sendMessage(
      this.reserva.id_chat,
      this.mensaje,
      this.user_login
    );

    // Restablezco el input
    this.mensaje = '';
  }
}
