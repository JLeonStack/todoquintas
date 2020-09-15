import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';

import { ReservacionService } from './reservacion.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private _reservacionService: ReservacionService
  ) {}

  // La siguiente función se encarga de optener la información de los chats.
  get(chatId) {
    return this.firestore
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  // La siguiente función crea un chat entre huéspedes y propietarios.
  create(info_chat: {
    huesped_id: string;
    user_prop_id: string;
    id_reserva: string;
  }) {
    const huesped_id = info_chat.huesped_id;
    const user_prop_id = info_chat.user_prop_id;

    const data = {
      huesped_id,
      user_prop_id,
      createdAt: Date.now(),
      count: 0,
      messages: [],
    };

    // const docRef = await this.firestore.collection('chats').add(data);
    this.firestore
      .collection('chats')
      .add(data)
      .then((doc) => {
        this._reservacionService.agregarIdChat(doc.id, info_chat.id_reserva);
      });
    // this.firestore.collection('chats').doc(`${user_prop_id}`).set(data);
    // return this.router.navigate(['chats', docRef.id]);
  }

  // La siguiente función se encargará de guardar en firebase el nuevo mensaje
  async sendMessage(chatId: string, content: string, user_id: string) {
    // La siguiente constante es la data que enviaré a firebase
    const data = {
      user_id,
      content,
      createdAt: Date.now(),
    };

    // Si existe un user_id, entonces proceso a actualizar el documento del chat id
    if (user_id) {
      const ref = this.firestore.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data),
      });
    }
  }
}
