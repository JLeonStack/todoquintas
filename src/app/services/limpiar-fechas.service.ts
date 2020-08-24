import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LimpiarFechasService {
  // Defino un evento que emitirá un string.
  LimpiezaFecha$ = new EventEmitter<any>();

  constructor() {}
}
