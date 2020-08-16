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
  prop_data = new FormGroup({
    propiedad: new FormControl('option1'),
    metros_cuadrado: new FormControl(),
    metros_cuadrado_cubiertos: new FormControl(),
    capacidad_alojamiento: new FormControl(0),
    dormitorios: new FormControl(),
    camas: new FormControl(),
    banos: new FormControl(),
    autos: new FormControl(),
    piscina: new FormControl(),
    parilla: new FormControl(),
  });

  constructor() {
    // this.crearFormulario();
    console.log(this.prop_data.controls.capacidad_alojamiento.value);
  }

  ngOnInit(): void {}

  guardar() {
    console.log(this.prop_data);
  }

  incrementarInput() {
    let valor = this.prop_data.get('capacidad_alojamiento').value;
    this.prop_data.patchValue({ capacidad_alojamiento: valor + 1 });
    // this.valueInput++;
  }

  reducirInput() {
    // if (this.valueInput > 0) {
    //   this.valueInput--;
    // }
  }
}
