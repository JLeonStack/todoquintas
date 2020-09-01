import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css'],
})
export class ReservationDialogComponent implements OnInit, OnChanges {
  @Input() intervalo_maxmin_fechas;

  reservar_data: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    // Creo el formulario con los campos.
    this.crearFormularioReservacion();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.intervalo_maxmin_fechas) {
      console.log(
        'Reservation:',
        this.intervalo_maxmin_fechas.fechas_disponibles
      );
      this.intervalo_maxmin_fechas = this.intervalo_maxmin_fechas.fechas_disponibles;
    }
  }

  ngOnInit(): void {}

  // La siguiente función se encarga de hacer el submit de la reservación.
  reservarPropiedad() {
    console.log(this.reservar_data.value);
  }

  crearFormularioReservacion() {
    this.reservar_data = this._formBuilder.group({
      personas_hospedar: [0],
      fechas_disponibles: this._formBuilder.group({
        precios: this._formBuilder.array([[0]]),
        fechas: this._formBuilder.array([[]]),
      }),
      usuario: [''],
      precio: [0],
    });
  }

  // Las siguientes son funciones encargadas de controlar el input de cantidad de personas que vayan a hospedarse en la propiedad

  incrementarInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.reservar_data.get(Object.keys(caracteristica)[0]).value;

    // Creo un objeto que pasaré al FormGroup
    let objeto = {};
    // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
    objeto[Object.keys(caracteristica)[0]] = valor + 1;

    // Actualizo el valor almacenado en el formGroup
    this.reservar_data.patchValue(objeto);
  }

  reducirInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.reservar_data.get(Object.keys(caracteristica)[0]).value;

    if (valor > 0) {
      // Creo un objeto que pasaré al FormGroup
      let objeto = {};
      // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
      objeto[Object.keys(caracteristica)[0]] = valor - 1;

      // Actualizo el valor almacenado en el formGroup
      this.reservar_data.patchValue(objeto);
    }
  }
}
