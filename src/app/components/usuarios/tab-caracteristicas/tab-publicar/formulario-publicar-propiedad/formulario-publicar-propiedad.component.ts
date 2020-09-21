import { Component, OnInit } from '@angular/core';

// Importanciones para manejar los formularios
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

// Servicio encargado de devolver las provincias y ciudades a los inputs a la hora de indicar la ubicación de la propiedad.
import { GeorefArgService } from '../../../../../services/georef-arg.service';
import { PropiedadesService } from '../../../../../services/propiedades.service';

// Me subscribo al observable a la espera de cambios
import { Subscription } from 'rxjs';

// Modelo de datos
import {
  PropiedadModel,
  PropiedadModelGet,
} from '../../../../../models/propiedad.model';

// Router
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario-publicar-propiedad',
  templateUrl: './formulario-publicar-propiedad.component.html',
  styleUrls: ['./formulario-publicar-propiedad.component.css'],
})
export class FormularioPublicarPropiedadComponent implements OnInit {
  // La siguiente propiead será del tipo FormGroup y almacenará todos los controles del formulario.
  prop_data: FormGroup;

  isEditable = true;

  // Latitud & Long
  coordenadasP = [];

  // En el presente vector almacenaré los nombres de las provincias
  provincias: any = [];
  // En el siguiente vector almacenaré toda la información que recibo de las provincias, con el objetivo de buscar en él las coordenadas una vez que el usuario seleccione la provincia.
  info_provincias: any = [];

  // Subscribes para el servicio.
  provinciaSubscripcion: Subscription;
  recogerCoordenadasSubscripcion: Subscription;
  getValuePropiedad: Subscription;

  desactivarBotonAgregarPeriodo = true;

  // Loading

  loading_cargar_propiedad = false;
  mensaje_error_campos = false;
  boton_publicar_bandera = false;

  // Este objeto es utilizado par almacenar las fechas provenientes del datepicker y, al mismo tiempo, retornar al componente datepicker de las fechas seleccionadas para restablecerlas.
  guardarFecha: Object = {
    start: null,
    end: null,
  };

  editar = true;
  modo_edicion = false;
  query: { edit: string; propiedad_id: string };
  // En el constructor inializaré el servicio y el formBuilder.
  constructor(
    private _formBuilder: FormBuilder,
    private _georefArgService: GeorefArgService,
    private _propiedadesService: PropiedadesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    // ? Ejecuto la función encargada de crear cada uno de los controles del formulario.
    this.crearFormulario();

    // ! Ejecutaré el método encargado de realizar la petición para obtener las provincias.
    this.provinciaSubscripcion = _georefArgService
      .obtener_provincia()
      .subscribe((data: any) => {
        this.info_provincias = data.provincias;

        // Recorreré el arreglo de las provincias con el objetivo de extraer del mismo solamente los nombres de cada una de las provincias y no toda la información asociada.
        for (let index = 0; index < data.provincias.length; index++) {
          //Agregaré cada provincia en el array this.provincias
          this.provincias.push(data.provincias[index].nombre);
        }
        // Ordenaré la lista de provincias en orden alfabético para ser desplegadas correctamente.
        this.provincias.sort();
      });
  }

  ngOnDestroy(): void {
    // Para evitar posibles llamadas duplicadas me voy a desubscribir de cada uno de los subscribe con los cuales recibod información del servicio.
    this.provinciaSubscripcion.unsubscribe();
    this.recogerCoordenadasSubscripcion.unsubscribe();
    if (this.getValuePropiedad) {
      this.getValuePropiedad.unsubscribe();
    }
  }

  // La siguiente función se encarga de setear todos los campos del formulario con la información de la propiedad para poder editarla.
  cargarFormularioEditar(propiedad) {
    this.prop_data
      .get('nombre_propiedad')
      .setValue(propiedad.propiedad.nombre_propiedad);
    this.prop_data.get('descripcion').setValue(propiedad.propiedad.descripcion);
    this.prop_data
      .get('metros_cuadrado')
      .setValue(propiedad.propiedad.metros_cuadrado);
    this.prop_data
      .get('metros_cuadrado_cubiertos')
      .setValue(propiedad.propiedad.metros_cuadrado_cubiertos);
    this.prop_data
      .get('capacidad_alojamiento')
      .setValue(propiedad.propiedad.capacidad_alojamiento);
    this.prop_data.get('dormitorios').setValue(propiedad.propiedad.dormitorios);
    this.prop_data.get('banos').setValue(propiedad.propiedad.banos);
    this.prop_data
      .get('solo_familia')
      .setValue(propiedad.propiedad.solo_familia);
    this.prop_data.get('piscina').setValue(propiedad.propiedad.piscina);
    this.prop_data.get('mascotas').setValue(propiedad.propiedad.mascotas);
    this.prop_data
      .get('apto_eventos')
      .setValue(propiedad.propiedad.apto_eventos);
    this.prop_data.get('tv').setValue(propiedad.propiedad.tv);
    this.prop_data.get('internet').setValue(propiedad.propiedad.internet);
    this.prop_data.get('lavarropas').setValue(propiedad.propiedad.lavarropas);
    this.prop_data.get('seguridad').setValue(propiedad.propiedad.seguridad);
    this.prop_data
      .get('aire_acondicionado')
      .setValue(propiedad.propiedad.aire_acondicionado);
    this.prop_data.get('calefaccion').setValue(propiedad.propiedad.calefaccion);
    this.prop_data.get('jacuzzi').setValue(propiedad.propiedad.jacuzzi);
    this.prop_data
      .get('serv_limpieza')
      .setValue(propiedad.propiedad.serv_limpieza);
    this.prop_data.get('ropa_cama').setValue(propiedad.propiedad.ropa_cama);
    this.prop_data.get('parilla').setValue(propiedad.propiedad.parilla);
    this.prop_data.get('provincia').setValue(propiedad.propiedad.provincia);
    this.prop_data.get('ciudad').setValue(propiedad.propiedad.ciudad);
    this.prop_data.get('provincia').setValue(propiedad.propiedad.provincia);
    this.prop_data.get('direccion').setValue(propiedad.propiedad.direccion);
    this.prop_data.get('coordenadas').setValue(propiedad.propiedad.coordenadas);
    this.prop_data
      .get('reserva_veinte_pciento')
      .setValue(propiedad.propiedad.reserva_veinte_pciento);

    // Emito las coordenadas al mapa para situarlo en la localización correcta
    this._georefArgService.AsignarCoordenadas$.emit([
      propiedad.propiedad.coordenadas.lat,
      propiedad.propiedad.coordenadas.lng,
    ]);

    console.log(propiedad.propiedad.fechas_disponibles.fechas);
    // El siguiente for añadirá a los formArray cada uno de los controles con sus respectivos valores.
    for (
      let i = 0;
      i < propiedad.propiedad.fechas_disponibles.fechas.length;
      i++
    ) {
      // A continuación procesaré la información proveniente de la propiead para convertir la fecha en formato de segundos a JSON
      let fecha_inicial = new Date(
        propiedad.propiedad.fechas_disponibles.fechas[i].start.seconds * 1000
      );
      let fecha_final = new Date(
        propiedad.propiedad.fechas_disponibles.fechas[i].end.seconds * 1000
      );

      // Almaceno en el apartado de fechas el valor en JSON.
      propiedad.propiedad.fechas_disponibles.fechas[i].start = JSON.parse(
        JSON.stringify(fecha_inicial)
      );
      // Almaceno en el apartado de fechas el valor en JSON.

      propiedad.propiedad.fechas_disponibles.fechas[i].end = JSON.parse(
        JSON.stringify(fecha_final)
      );

      (this.prop_data
        .get('fechas_disponibles')
        .get('fechas') as FormArray).push(
        this._formBuilder.control(
          propiedad.propiedad.fechas_disponibles.fechas[i],
          Validators.required
        )
      );

      (this.prop_data
        .get('fechas_disponibles')
        .get('precios') as FormArray).push(
        this._formBuilder.control(
          propiedad.propiedad.fechas_disponibles.precios[i],
          Validators.required
        )
      );
    }
  }

  ngOnInit(): void {
    // Me subscribo a la ruta para obtener los parámetros
    this._activatedRoute.queryParamMap.subscribe((params: any) => {
      console.log(params);

      // Obtengo los parámetros que vienen por url
      var query: { edit: string; propiedad_id: string } = params.params;
      this.query = params.params;

      // Si recibo una confirmación de editar, procedo a subscribirme a la variable que persiste los datos de la propiedad para mostrar en cada input la correspondiente información.
      if (query.edit == 'true') {
        this.modo_edicion = true;
        this.files.push(new File([], 'test'));
        this.editar = false;
        (this.prop_data
          .get('fechas_disponibles')
          .get('fechas') as FormArray).removeAt(0);
        (this.prop_data
          .get('fechas_disponibles')
          .get('precios') as FormArray).removeAt(0);
        // Me subscribo a la variable que almacena las propiedades
        this.getValuePropiedad = this._propiedadesService
          .getValue()
          .subscribe((data: PropiedadModelGet[]) => {
            // Si obtengo data de la variable procederé a obtener el id de la propiedad
            if (data) {
              console.log('Query', query);

              // A continuación filtro la propiedad que se quiere editar dentro del array de propiedades y la almaceno en una variable temporal
              let propiedadEditar = Object.values(data).filter(
                (item) => item.propiedad_id == query.propiedad_id
              );
              console.log(propiedadEditar);

              this.cargarFormularioEditar(propiedadEditar[0]);
            }
          });
      } else {
        this.crearFormulario();
        this.files = [];
        // En caso de que no se detecte la intención de editar, crearé dos controles con valores nulos para poder realizar una publicación.

        /* Formcontrol de fecha */
        (this.prop_data
          .get('fechas_disponibles')
          .get('fechas') as FormArray).push(
          this._formBuilder.control([], Validators.required)
        );

        /* Formcontrol de precio */
        (this.prop_data
          .get('fechas_disponibles')
          .get('precios') as FormArray).push(
          this._formBuilder.control([], Validators.required)
        );
      }
    });

    // Cada vez que el usuario seleccione una provincia en particular, me subscribé a los cambios del input para ejecutar el siguiente conjunto de instrucciones
    this.prop_data.controls.provincia.valueChanges.subscribe((provincia) => {
      // Lo que haré será recorrer cada una de las provincias en busca de aquella que coincida con la seleccionada en el input select-

      for (let index = 0; index < this.info_provincias.length; index++) {
        if (provincia == this.info_provincias[index].nombre) {
          // Una vez encontrada la provincia que coincida con la selecccionada en el input select, procederé a almacenar las coordenadas que tiene la provincia y posteriormente emitiré un evento para que sea recibido por el componente mapa y redirrecionar la ubicación.
          this.coordenadasP = [
            this.info_provincias[index].centroide.lat,
            this.info_provincias[index].centroide.lon,
          ];
        }
      }

      // Emitiré un evento al servicio, pasando como parámetros las coordenadas que posee la provincia. Estas coordenadas serán recibidas en el componente <mapa> para cambiar la "vista ubicación" hacia la provincia seleccionada
      this._georefArgService.AsignarCoordenadas$.emit(this.coordenadasP);
    });

    // Con el siguiente subscribe recogeré las coordenadas marcadas en el mapa y las añadire al formulario.
    this.recogerCoordenadasSubscripcion = this._georefArgService.RecogerCoordenadas$.subscribe(
      (data: any) => {
        // Crearé una variable objeto temporal para ser capaz de pasarla al FormBuilder para actualizar las coordenadas
        let objeto = {
          coordenadas: { ...data },
        };

        // La única forma de actualizar un valor en un formgroup es a través del método patchValue
        this.prop_data.patchValue(objeto);
      }
    );
  }

  // La siguinte función se encarga de realizar el submit del formulario
  guardarFormulario() {
    this.mensaje_error_campos = false;
    this.loading_cargar_propiedad = false;
    this.prop_data.value.ciudad = this.prop_data.value.ciudad.toLowerCase();
    console.log(this.prop_data.value);
    // Creo un objeto temporal para colocar la información del usuario
    let publicar_propiedad_objeto: PropiedadModel = {
      user_prop_id: localStorage.getItem('_u_ky'),
      propiedad: {
        ...this.prop_data.value,
      },
      calificacion: [0],
      img_f: [],
    };

    // Cuando el formulario sea válido, procederé a publicar la propiedad
    if (this.prop_data.valid) {
      let validacion = this.validarFormulario(this.prop_data.value);
      if (validacion) {
        console.log('Se puede publicar');
        this.loading_cargar_propiedad = true;
        this.boton_publicar_bandera = true;

        // Si estamos en modo edición, actualizaré la propiedad
        if (this.modo_edicion) {
          let actualizar_propiedad = {
            propiedad: {
              ...this.prop_data.value,
            },
          };
          this._propiedadesService
            .actualizarPropiedad(actualizar_propiedad, this.query.propiedad_id)
            .then((data) => {
              // Procedo a desactivar el loading
              console.log('data publicar,', data);
              this.loading_cargar_propiedad = false;
              this._router.navigate(['/usuario', 'propiedades']);
              setTimeout(() => {
                window.location.reload();
              }, 500);
            });
          console.log('Modo edición');
        } else {
          this._propiedadesService
            .publicarPropiedad(publicar_propiedad_objeto, this.files)
            .then((data: boolean) => {
              // Procedo a desactivar el loading
              if (data) {
                console.log('data publicar,', data);
                this.loading_cargar_propiedad = false;
                this._router.navigate(['/usuario', 'propiedades']);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }
            })
            .catch((err: boolean) => {
              if (err) {
                console.log(err);
              }
            });
        }
      } else {
        this.mensaje_error_campos = true;
        console.log('Hay campos incompletos');
      }
    } else {
      this.mensaje_error_campos = true;
      console.log('Hay campos incompletos');
    }
  }

  validarFormulario(propiedad: any) {
    if (propiedad.nombre_propiedad == '') {
      return false;
    } else if (propiedad.descripcion == '') {
      return false;
    } else if (propiedad.metros_cuadrado == null) {
      return false;
    } else if (propiedad.metros_cuadrado_cubiertos == null) {
      return false;
    } else if (propiedad.capacidad_alojamiento == 0) {
      return false;
    } else if (propiedad.dormitorios == 0) {
      return false;
    } else if (propiedad.banos == 0) {
      return false;
    } else if (propiedad.provincia == '') {
      return false;
    } else if (propiedad.ciudad == '') {
      return false;
    } else if (propiedad.direccion == '') {
      return false;
    } else if (propiedad.fechas_disponibles.precios[0] == null) {
      return false;
    } else if (propiedad.fechas_disponibles.fechas[0] == null) {
      return false;
    } else if (this.files.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  // La siguiente función se encargará de crear el formulario con cada uno de los controles.
  crearFormulario() {
    this.prop_data = this._formBuilder.group({
      tipo_propiedad: ['quinta', Validators.required],
      nombre_propiedad: ['', Validators.required],
      descripcion: ['', Validators.required],
      metros_cuadrado: [0, Validators.required],
      metros_cuadrado_cubiertos: [0, Validators.required],
      capacidad_alojamiento: [0],
      dormitorios: [0],
      banos: [0],
      solo_familia: [false],
      piscina: [false],
      mascotas: [false],
      apto_eventos: [false],
      tv: [false],
      internet: [false],
      lavarropas: [false],
      seguridad: [false],
      aire_acondicionado: [false],
      calefaccion: [false],
      jacuzzi: [false],
      serv_limpieza: [false],
      ropa_cama: [false],
      parilla: [false],

      provincia: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      coordenadas: [
        [
          {
            lat: -34.600997983065824,
            lng: -58.449325561523445,
          },
        ],
      ],
      fechas_disponibles: this._formBuilder.group({
        precios: this._formBuilder.array([]),
        fechas: this._formBuilder.array([]),
      }),

      reserva_veinte_pciento: [false, Validators.required],
    });
  }

  // Getters

  get nombreNoValidoPropiedad() {
    return this.prop_data.get('nombre_propiedad').hasError('required');
  }

  get descripcionNoValida() {
    return this.prop_data.get('descripcion').hasError('required');
  }

  get metrosCuadradosTotalesNoValido() {
    return this.prop_data.get('metros_cuadrado').hasError('required');
  }

  get metrosCuadradosCubiertosNoValido() {
    return this.prop_data.get('metros_cuadrado_cubiertos').hasError('required');
  }

  // La siguiente función sirve como indicar de cuántos controles del tipo array existen en el formulario para posteriormente recorrerlos con un ciclo for e imprimirlos en pantalla.
  getPrecios() {
    return (this.prop_data
      .get('fechas_disponibles')
      .get('precios') as FormArray).controls;
  }

  // A continuación retornaré
  getFecha(i) {
    return (this.prop_data.get('fechas_disponibles').get('fechas') as FormArray)
      .controls[i].value;
  }

  incrementarInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.prop_data.get(Object.keys(caracteristica)[0]).value;

    // Creo un objeto que pasaré al FormGroup
    let objeto = {};
    // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
    objeto[Object.keys(caracteristica)[0]] = valor + 1;

    // Actualizo el valor almacenado en el formGroup
    this.prop_data.patchValue(objeto);
  }

  reducirInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.prop_data.get(Object.keys(caracteristica)[0]).value;

    if (valor > 0) {
      // Creo un objeto que pasaré al FormGroup
      let objeto = {};
      // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
      objeto[Object.keys(caracteristica)[0]] = valor - 1;

      // Actualizo el valor almacenado en el formGroup
      this.prop_data.patchValue(objeto);
    }
  }

  retornarMinusculas(str) {
    return str.toLowerCase();
  }
  // La siguiente función se encargará de agregar los nuevos controles al array de precios y de fechas.
  agregarPeriodo() {
    // Agrego el nuevo control al array precios.
    this.desactivarBotonAgregarPeriodo = true;
    this.desactivarbnb = this.desactivarbnb + 1;
    (this.prop_data.get('fechas_disponibles').get('precios') as FormArray).push(
      this._formBuilder.control(0, Validators.required)
    );

    (this.prop_data.get('fechas_disponibles').get('fechas') as FormArray).push(
      this._formBuilder.control(null, Validators.required)
    );
  }
  desactivarbnb = 1;

  desactivarBotonBorrado(i) {
    if (i == 0) {
      return true;
    }
    if (i < this.desactivarbnb - 1) {
      return true;
    }
  }
  // La siguiente función se encargará de eliminar los controles cuando se haga click en la cruz de las filas de la tabla.
  borrarPeriodo(i: number) {
    this.desactivarBotonAgregarPeriodo = false;
    this.desactivarbnb = this.desactivarbnb - 1;

    // Removeré del array precios, aquel en la posición indicada en el índice que recibo como parámetro
    (this.prop_data
      .get('fechas_disponibles')
      .get('precios') as FormArray).removeAt(i);

    // Removeré del array fecha, aquel en la posición indicada en el índice que recibo como parámetro
    (this.prop_data
      .get('fechas_disponibles')
      .get('fechas') as FormArray).removeAt(i);

    let controles = (this.prop_data
      .get('fechas_disponibles')
      .get('fechas') as FormArray).controls;

    // console.log(controles);
    if (controles[controles.length - 1].value != null) {
      this.guardarFecha = controles[controles.length - 1].value;
      // console.log(this.guardarFecha);
    }
  }

  vectorFechas = [];
  // La siguiente función se encargará de recibir el Output del calendario, el rango de fechas seleccionado en el mismo.
  // Para esto recibiré un parámetro event, y una posición i que me indirá la posición del array en el que debo almacenar
  recogerFechas(event: any, i: number) {
    this.vectorFechas[i] = event;
    // console.log('Vectorrr', this.vectorFechas);
    // console.log(i);
    // Defino una variable controles que contendrá un array de controles de las
    let controles = (this.prop_data
      .get('fechas_disponibles')
      .get('fechas') as FormArray).controls;

    // A continuación evaluo si la información que proviene del date picker corresponde a una modificación hecha en la selección de la fecha inicial o de la fecha final, y almaceno todo esto enn un objeto guardarFecha que actualizará la información del FormGrouup

    controles[i].setValue(event);
    if (controles[i].value.start != null && controles[i].value.end != null) {
      this.desactivarBotonAgregarPeriodo = false;
    }
    this.guardarFecha = controles[controles.length - 1].value;
  }

  //! Eventos encargados de gestionar los archivos que se suben al drag&Drop.
  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    console.log(this.files[0]);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    // console.log(this.files);
  }

  descripcion_ayuda_ciudad =
    'Nuestros algoritmos trabajan en base a las ubicaciones. \nPara que sean capaces de indexar su propiedad, debe ingresar el nombre completo de su ciudad.';

  descripcion_ayuda_direccion =
    'La direccion exacta de su vivienda sólo se enviará a las personas que realicen una reservación.';
  descripcion_ayuda_mapa =
    'La ubicación señalada en el mapa será mostrada a los usuarios.';

  descripcion_ayuda_periodo =
    'Los períodos son intervalos de tiempo en que usted puede permitir que sea reservada su propiedad. En cada uno de ellos puede ser asignado un precio distinto de acuerdo a la época del año.';

  descripcion_ayuda_nombre_propiedad =
    'El nombre de la propiedad es un nombre de fantasía con el cual será identificada su propiedad en el sitio.';

  descripcion_ayuda_descripcion_propiedad =
    'Describe lo que hace única a tu propiedad y por qué los usuarios deberían escogerla.';

  descripcion_ayuda_veinte_porciento =
    'Los huéspedes abonarán el 20% de la reserva a través de MercadoPago, y el otro 80% en efectivo al llegar a la propiedad.';
}
