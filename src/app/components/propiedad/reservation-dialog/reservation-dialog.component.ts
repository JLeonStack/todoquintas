import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Importaciones para manejar los formularios.
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Importaciones necesarias para poder mostrar el dialog con la tabla de precios.
import { MatDialog } from '@angular/material/dialog';
import { DialogPrecioComponent } from './dialog-precio/dialog-precio.component';

import { ActivatedRoute, Router } from '@angular/router';

// Servicios
import { ReservacionService } from '../../../services/reservacion.service';

// Modelos
import { PropiedadIndividualGetModel } from '../../../models/propiedad.model';

import { ReservarPropiedadModel } from '../../../models/reservar.model';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css'],
})
export class ReservationDialogComponent implements OnInit, OnChanges {
  // En el siguiente input, yo recibiré la información que envié desde la página "propiedad"
  // Esta información incluirá las fechas min-max que pueden ser seleccionadas en la propiedad.
  @Input() propiedad: PropiedadIndividualGetModel;

  // Creo una nueva propiedad del tipo FormGroup, donde almacenaré los distintos formcontrol que tendrá el formulario de reservación
  reservar_data: FormGroup;

  // El siguiente es el array que almacenará las fechas en formato yy-mm-dd
  array_fechas = [];

  // El siguiente es el array con las fechas en formato JSON.
  array_fechas_json = [];

  fechas_disponibles;

  loading = false;
  loading_text = false;
  loading_error = false;

  reservar_permitido_denegado = false;

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _reservacionService: ReservacionService,
    private router: Router
  ) {}

  // Escucho los cambios que se produzcan en el input propiedad
  ngOnChanges(changes: SimpleChanges) {
    // Si el input contiene informarmación, entonces, proceré a almacenar en él, el intervalo de fechas que estará disponible para ser reservado.
    if (this.propiedad) {
      // console.log('Info propiedad, reservation:', this.propiedad);

      console.log(
        'Fechas disponibles enviando al date-picker:',
        this.propiedad.propiedad.fechas_disponibles
      );

      this.fechas_disponibles = this.propiedad.propiedad.fechas_disponibles;
    }
  }

  ngOnInit(): void {
    // Creo el formulario con los campos.
    this.crearFormularioReservacion();

    // Chequeo si existe la cookie de Auth0 en el sistema, para determinar si debo o no permitir reservar al usuario.
    this.reservar_permitido_denegado = this.checkCookieAuth0();
  }

  // La siguiente función se encarga de hacer el submit de la reservación.
  reservarPropiedad() {
    let auth0_id_huesped = localStorage.getItem('_u_ky');

    let reporteReserva: ReservarPropiedadModel = this.reservar_data.value;

    reporteReserva.prop_info = this.propiedad.prop_info;
    reporteReserva.características_propiedad = {
      tipo_propiedad: this.propiedad.propiedad.tipo_propiedad,
      nombre_propiedad: this.propiedad.propiedad.nombre_propiedad,
      direccion: this.propiedad.propiedad.direccion,
      ciudad: this.propiedad.propiedad.ciudad,
      provincia: this.propiedad.propiedad.provincia,
      coordenadas: this.propiedad.propiedad.coordenadas,
    };
    reporteReserva.reserva_confirmada = 0;
    reporteReserva.user_prop_id = this.propiedad.user_prop_id;
    reporteReserva.propiedad_id = this.propiedad.propiedad_id;
    reporteReserva.huesped_id = auth0_id_huesped;

    console.log(reporteReserva);

    this.loading = false;
    this.loading_text = false;
    this.loading_error = false;

    // Si el formulario es válido, es decir, si todos sus campos están completos, procederé a guardar la reserva en firebase.
    if (this.reservar_data.valid) {
      this.loading_text = false;
      // Si el formulario está completo, desactivo el mensaje de error
      this.loading_error = false;
      // Una vez que he hace click en el formulario, procederé a activar la simulación del "loading"
      this.loading = true;

      // Llamo al service para que guarde en firebase la reserva
      let reservarPromise = this._reservacionService.reservarPropiedad(
        this.reservar_data.value
      );
      // Como se retorna una promeso, decido capturar lo que me devuelve, de tal forma que cuando se acabe de guardar la reservación, puedo desactivar el loading, y mostrar un texto en pantalla indicando que se ha reservado la propiedad correctamente.
      reservarPromise
        .then((data) => {
          console.log('Se guardó en firebase');
          this.loading = false;
          this.loading_text = true;
          // console.log(data);
          // Una vez que se ha reservado correctamente, procedo a llevar al usuario al apartado de reservaciones, en la sección de usuario
          setTimeout(() => {
            // this.router.navigate(['/usuario']);
          }, 1000);
        })
        .catch((err) => {
          this.loading_error = true;
        });
    } else {
      this.loading_error = true;
    }
  }

  // La siguiente función se encarga de la creación de los distintos form-controls.
  crearFormularioReservacion() {
    // A conitnuación creo un grupo con los diferentes controles.
    this.reservar_data = this._formBuilder.group({
      personas_hospedar: [null, Validators.required],
      fechas_reservadas: [null, Validators.required],
      precio: [null, Validators.required],
    });
    // console.log(this.reservar_data);
  }

  // La siguiente función se encargará de recibir el Output del calendario, el rango de fechas seleccionado en el mismo.
  recogerFechas(event: any) {
    if (event.start && event.end) {
      let guardarFecha = {
        start: JSON.parse(JSON.stringify(event.start)),
        end: JSON.parse(JSON.stringify(event.end)),
      };
      this.reservar_data.get('fechas_reservadas').setValue(guardarFecha);
      this.calcularRangoEntreFechas(guardarFecha);
    }
    if (event.start == null && event.end == null) {
      this.reservar_data.get('fechas_reservadas').setValue(null);
    }
  }

  // La siguiente función se encargará de calcular el precio total que se deberá abonar según el rango de fechas, y el precio para cada uno de los períodos.
  calcularPrecioReservacion() {
    // A continuación almacenaré el precio total que se deberá abonar por los días reservados.
    let precio = 0;

    // Almaceno la longitud
    let longitud_array = this.array_fechas_json.length;

    let contador_dias_pagados = 0;
    let contador_dias = 0;

    // Cuento con dos ciclos for, uno de ellos recorrerá cada uno de los períodos de fechas disponibles.
    // Y a continuación se recorrerán cada una de las fechas seleccionadas por el usuario para reservar. En caso de que éstas sean menor o igual al paríodo

    for (
      let periodo = 0;
      periodo <= this.fechas_disponibles.fechas.length;
      periodo++
    ) {
      // El siguiente for recorrerá el array de fechas en formato json.
      for (let i = contador_dias; i < this.array_fechas_json.length; i++) {
        // Lo que se hará a continuación es evaluar si la fecha en la posición i del array (JSON) es menor a la fecha final del primer período de fechas disponibles para ser reservadas
        if (
          new Date(this.array_fechas_json[i]).getTime() <
          this.fechas_disponibles.fechas[periodo].end.seconds * 1000
        ) {
          // En caso de que sea cierto, procederé a acumular los precios correspondientes a ese fecha.
          precio = precio + this.fechas_disponibles.precios[periodo];
          contador_dias_pagados++;
          contador_dias++;

          // Una vez que se han acumulador todos los días a pagar, y éste coincida con la cantidad de días que efectivamente se quieren reservar, procederé a cortar el ciclo for.
        }
        if (
          new Date(this.array_fechas_json[i]).getTime() ==
          this.fechas_disponibles.fechas[periodo].end.seconds * 1000
        ) {
          console.log('Encontré una fecha igual a la fecha final de período');
          break;
        }

        // En caso de que la fecha actual que se pretenda reservar sea mayor a la que admite el actual período de fechas, entonces procederé a cortar este for, para pasar al siguiente período de fechas.
        if (
          new Date(this.array_fechas_json[i]).getTime() >
          this.fechas_disponibles.fechas[periodo].end.seconds * 1000
        ) {
          break;
        }
      }

      // Una vez que se han acumulador todos los días a pagar, y éste coincida con la cantidad de días que efectivamente se quieren reservar, procederé a cortar el ciclo for.
      if (contador_dias_pagados == longitud_array) {
        // console.log('Cortando');
        break;
      }
    }

    this.reservar_data.get('precio').setValue(precio);
    // console.log('Precio:', precio);
  }

  // La siguiente función se encargará de tomar el intervalo de fechas que ha seleccionado el usuario, y desestructurarlo en un array con todas las fechas que componen este intervalo. Es decir:
  /* Si el usuario selecciona: 1-09-2020 hasta 20-09-2020, el array estará comprendido por cada una de las fechas entre ese intervalo, incluyendo los extremos. */
  calcularRangoEntreFechas(rango_fecha_usuario) {
    // El siguiente es el array que almacenará las fechas en formato yy-mm-dd
    this.array_fechas = [];

    // El siguiente es el array con las fechas en formato JSON.
    this.array_fechas_json = [];
    /* Tomaré la fecha inicial selecciona por el usuario, que proviene en formato JSON, y la convertiré en formato string, para posteriormente poder utilizar los métodos de un objeto Date. */
    let newDate = new Date(rango_fecha_usuario.start).toString();

    /* Proceso a convertir ahora la fecha final seleccionada por el usuario. */
    let newDateEnd = new Date(rango_fecha_usuario.end).toString();

    // Formateo la fecha obtenida para que ahora sea del tipo Date.
    let newDate_2 = new Date(newDate);
    let newDateEnd_2 = new Date(newDateEnd);

    // Fabrico una fecha inciial en el formato yy-mm-dd
    let fecha_inicio = `${newDate_2.getFullYear()}/${
      newDate_2.getMonth() + 1
    }/${newDate_2.getDate()}`;
    // console.log(fecha_inicio);

    // Fabrico una fecha final en el formato yy-mm-dd
    let fecha_final = `${newDateEnd_2.getFullYear()}/${
      newDateEnd_2.getMonth() + 1
    }/${newDateEnd_2.getDate()}`;

    // console.log(fecha_final);

    // Establezco una nueva fecha inicial, y final, para poder generar el array con las fechas comprendidas entre ese intervalo
    var fechaInicio = new Date(fecha_inicio);
    var fechaFin = new Date(fecha_final);

    // Mientras la fecha final sea mayor a la fecha inicial, procederé a ejecutar el ciclo while
    while (fechaFin.getTime() >= fechaInicio.getTime()) {
      this.array_fechas.push(
        `${
          fechaInicio.getFullYear() +
          '/' +
          (fechaInicio.getMonth() + 1) +
          '/' +
          fechaInicio.getDate()
        }`
      );
      // Agregaré un elemento al array de fechas en formato yy-mm-dd

      fechaInicio.setDate(fechaInicio.getDate() + 1);
    }

    /* A continuación lo que haré será recorrer todo el array de fechas en formato yy-mm-dd y paso a convertirlas en formato JSON: 2020-09-08T03:00:00.000Z */

    for (let i = 0; i < this.array_fechas.length - 1; i++) {
      this.array_fechas_json[i] = JSON.parse(
        JSON.stringify(new Date(this.array_fechas[i]))
      );
    }

    console.log(this.array_fechas_json);

    this.calcularPrecioReservacion();
  }

  // Obtengo la cookie según el parámetro de búsqueda
  getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(';');

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');

      /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
      if (name == cookiePair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if not found
    return null;
  }

  // Chequeo que el usuario esté logueado para poder habilitar el botón de reservación
  checkCookieAuth0() {
    // Get cookie using our custom function
    var autenticado = this.getCookie('auth0.is.authenticated');
    // console.log(autenticado);
    if (autenticado == null) {
      return false;
    } else {
      return true;
    }
  }

  // La siguiente función se encargará de desplejar el cuadro de diálogo correspondiente a la tabla de precios
  openDialog() {
    let array_fechas = [];

    // Recorro las fechas disponibles para convertir los segundos a una fecha capaz de ser almacenada
    for (let i = 0; i < this.fechas_disponibles.fechas.length; i++) {
      let minDate = new Date(
        this.fechas_disponibles.fechas[i].start.seconds * 1000
      );
      let maxDate = new Date(
        this.fechas_disponibles.fechas[i].end.seconds * 1000
      );

      // Convierto las fechas a formato dd-mm-yy
      let minFormatdate = `${minDate.getDate()}/${
        minDate.getMonth() + 1
      }/${minDate.getFullYear()}`;
      let maxFormatdate = `${maxDate.getDate()}/${
        maxDate.getMonth() + 1
      }/${maxDate.getFullYear()}`;

      array_fechas.push({
        start: minFormatdate,
        end: maxFormatdate,
        precio: this.fechas_disponibles.precios[i],
      });
    }

    console.log([...array_fechas]);

    this.dialog.open(DialogPrecioComponent, {
      data: [...array_fechas],
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
