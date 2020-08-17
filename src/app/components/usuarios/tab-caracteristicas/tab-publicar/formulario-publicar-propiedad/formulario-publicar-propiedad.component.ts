import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-formulario-publicar-propiedad',
  templateUrl: './formulario-publicar-propiedad.component.html',
  styleUrls: ['./formulario-publicar-propiedad.component.css'],
})
export class FormularioPublicarPropiedadComponent implements OnInit {
  prop_data: FormGroup;
  isEditable = true;
  constructor(private _formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
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
      autos: [0],
      piscina: [true],
      parilla: [false],
      wifi: [false],
      seguridad: [false],
      tv: [false],
    });
  }
}
