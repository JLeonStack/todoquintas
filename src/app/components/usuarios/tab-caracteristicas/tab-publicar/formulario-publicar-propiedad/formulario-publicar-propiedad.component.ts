import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

// Servicio encargado de devolver las provincias y ciudades a los inputs a la hora de indicar la ubicación de la propiedad.
import { GeorefArgService } from '../../../../../services/georef-arg.service';

@Component({
  selector: 'app-formulario-publicar-propiedad',
  templateUrl: './formulario-publicar-propiedad.component.html',
  styleUrls: ['./formulario-publicar-propiedad.component.css'],
})
export class FormularioPublicarPropiedadComponent implements OnInit {
  prop_data: FormGroup;
  isEditable = true;

  coordenadasP = {
    lat: 12,
    long: 5,
  };
  // Los siguientes dos listas almacenarán las provincias y ciudades por cada una de ellas.
  provincias: any = [];
  ciudades: any = [];

  // Cuando se haya seleccionado una provincia se permitirá elegir una ciudad asociada a la misma.
  input_municipios = true;

  // En el constructor inializaré el servicio y el formBuilder.
  constructor(
    private _formBuilder: FormBuilder,
    private _georefArgService: GeorefArgService
  ) {
    // ? Ejecuto la función encargada de crear cada uno de los controles del formulario.
    this.crearFormulario();

    // ! Ejecutaré el método encargado de realizar la petición para obtener las provincias.
    _georefArgService.obtener_provincia().subscribe((data: any) => {
      // Recorreré el arreglo de las provincias con el objetivo de extraer del mismo solamente los nombres de cada una de las provincias y no toda la información asociada.
      for (let index = 0; index < data.provincias.length; index++) {
        //Agregaré cada provincia en el array this.provincias
        this.provincias.push(data.provincias[index].nombre);
      }
      // Ordenaré la lista de provincias en orden alfabético para ser desplegadas correctamente.
      this.provincias.sort();

      // console.log(this.provincias);
    });
  }

  ngOnInit(): void {
    // Cada vez que el usuario seleccione una provincia en particular, me subscribé a los cambios del input para ejecutar el siguiente conjunto de isntrucciones
    this.prop_data.controls.provincia.valueChanges.subscribe((provincia) => {
      this.coordenadasP = {
        lat: 15,
        long: 2,
      };
      // En primer luar, habilitaré el input de ciudades
      this.input_municipios = false;
      // Establezco en 0 el array de ciudades para limpiar el select input
      this.ciudades = [];

      // Realizaré una petición al servicio georef para obtener las ciudades.
      this._georefArgService
        .obtener_ciudad(provincia)
        .subscribe((ciudad: any) => {
          // Recorreré cada una de las ciudades para obtener los nombres que serán desplegados en el select input
          for (let index = 0; index < ciudad.municipios.length; index++) {
            // Agrego cada nombre de las ciudades al array.
            this.ciudades.push(ciudad.municipios[index].nombre);
            // Ordeno alfabéticamente las ciudades
            this.ciudades.sort();
          }
          console.log(this.ciudades);
        });
    });
  }

  guardar() {
    console.log(this.prop_data);
  }

  incrementarInput(caracteristica) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.prop_data.get(Object.keys(caracteristica)[0]).value;

    // Creo un objeto que pasaré al FormGroup
    let objeto = {};
    // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
    objeto[Object.keys(caracteristica)[0]] = valor + 1;

    // Actualizo el valor almacenado en el formGroup
    this.prop_data.patchValue(objeto);
  }

  reducirInput(caracteristica) {
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

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  crearFormulario() {
    this.prop_data = this._formBuilder.group({
      propiedad: ['option1', Validators.required],
      nombre_propiedad: ['', Validators.required],
      descripcion: ['', Validators.required],
      metros_cuadrado: [0],
      metros_cuadrado_cubiertos: [0],
      capacidad_alojamiento: [0],
      dormitorios: [0],
      banos: [0],
      solo_familia: [true],
      piscina: [true],
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

      provincia: [''],
    });
  }
}
