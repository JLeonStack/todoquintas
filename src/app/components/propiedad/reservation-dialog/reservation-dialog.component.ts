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
  // En el siguiente input, yo recibiré la información que envié desde la página "propiedad"
  // Esta información incluirá las fechas min-max que pueden ser seleccionadas en la propiedad.
  @Input() intervalo_maxmin_fechas;

  // Creo una nueva propiedad del tipo FormGroup, donde almacenaré los distintos formcontrol que tendrá el formulario de reservación
  reservar_data: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    // Creo el formulario con los campos.
    this.crearFormularioReservacion();
  }

  // Escucho los cambios que se produzcan en el input intervalo_maxmin_fechas
  ngOnChanges(changes: SimpleChanges) {
    // Si el input contiene informarmación, entonces, proceré a almacenar en él, el intervalo de fechas que estará disponible para ser reservado.
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

  // La siguiente función se encarga de la creación de los distintos form-controls.
  crearFormularioReservacion() {
    this.reservar_data = this._formBuilder.group({
      personas_hospedar: [0],
      fechas_disponibles: [''],
      usuario: [''],
      precio: [0],
      propiedad_id: [''],
    });
  }

  // Este objeto es utilizado par almacenar las fechas provenientes del datepicker y, al mismo tiempo, retornar al componente datepicker de las fechas seleccionadas para restablecerlas.
  guardarFecha: Object = {
    start: null,
    end: null,
  };

  vectorFechas = [];
  // La siguiente función se encargará de recibir el Output del calendario, el rango de fechas seleccionado en el mismo.
  // Para esto recibiré un parámetro event, y una posición i que me indirá la posición del array en el que debo almacenar
  recogerFechas(event: any) {
    console.log(event);
    // this.vectorFechas[i] = event;
    // console.log('Vectorrr', this.vectorFechas);
    // console.log(i);
    // Defino una variable controles que contendrá un array de controles de las
    // let controles = (this.this.reservar_data
    //   .get('fechas_disponibles')
    //   .get('fechas') as FormArray).controls;

    // A continuación evaluo si la información que proviene del date picker corresponde a una modificación hecha en la selección de la fecha inicial o de la fecha final, y almaceno todo esto enn un objeto guardarFecha que actualizará la información del FormGrouup

    // controles[i].setValue(event);

    // this.guardarFecha = controles[controles.length - 1].value;
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
