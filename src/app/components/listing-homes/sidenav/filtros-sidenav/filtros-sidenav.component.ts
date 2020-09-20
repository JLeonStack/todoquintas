import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Importanciones para manejar los formularios
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Rutas
import { ActivatedRoute, Router } from '@angular/router';

// Modelo de datos
import { Busqueda } from '../../../../models/busqueda.model';

//Servicios

import { LugaresSearchUbicacionService } from '../../../../services/lugares-search-ubicacion.service';

@Component({
  selector: 'app-filtros-sidenav',
  templateUrl: './filtros-sidenav.component.html',
  styleUrls: ['./filtros-sidenav.component.css'],
})
export class FiltrosSidenavComponent implements OnInit {
  // El siguiente output se encarga de enviar un evento al padre para cerrar el sidenav
  @Output() cerrarSidenav: EventEmitter<boolean>;

  // Propiedad que almaceará los distintos controles del formulario [filtro]
  public filtro_form: FormGroup;

  private busqueda: Busqueda;

  queryParams = {
    filtro: 'true',
  };

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
    private _lugaresSearchUbicacionService: LugaresSearchUbicacionService
  ) {
    this.cerrarSidenav = new EventEmitter();
  }

  ngOnInit(): void {
    // Creo el formulario
    this.crearFormulario();
    this.valuesChangesFormControls();

    // A continuación me subscribiré a la ruta con el objetivo de obtener los parámetros de búsqueda que ha solicitado el usuario.
    this.route.queryParamMap.subscribe((params: any) => {
      // console.log(params.params);

      // A continuación almaceno en búsqueda
      this.busqueda = params.params;

      this.filtro_form.get('ubicacion').setValue(this.busqueda.ubicacion);
      this.queryParams['ubicacion'] = this.filtro_form.get('ubicacion').value;

      this.filtro_form.get('propiedad').setValue(this.busqueda.propiedad);
      this.queryParams['propiedad'] = this.filtro_form.get('propiedad').value;

      this.filtro_form
        .get('huespedes')
        .setValue(parseInt(this.busqueda.huespedes));
      this.queryParams['huespedes'] = parseInt(
        this.filtro_form.get('huespedes').value
      );
    });
  }

  valuesChangesFormControls() {
    this.filtro_form.get('propiedad').valueChanges.subscribe((value) => {
      this.queryParams['propiedad'] = value;
    });
    this.filtro_form.get('huespedes').valueChanges.subscribe((value) => {
      this.queryParams['huespedes'] = value;
    });

    this.filtro_form.get('dormitorios').valueChanges.subscribe((value) => {
      this.queryParams['dormitorios'] = value;
    });

    this.filtro_form.get('banos').valueChanges.subscribe((value) => {
      this.queryParams['banos'] = value;
    });

    /* Detalles propiedad */
    this.filtro_form.get('internet').valueChanges.subscribe((value) => {
      this.queryParams['internet'] = value;
    });

    this.filtro_form.get('piscina').valueChanges.subscribe((value) => {
      this.queryParams['piscina'] = value;
    });

    this.filtro_form.get('tv').valueChanges.subscribe((value) => {
      this.queryParams['tv'] = value;
    });

    this.filtro_form.get('seguridad').valueChanges.subscribe((value) => {
      this.queryParams['seguridad'] = value;
    });

    this.filtro_form.get('mascotas').valueChanges.subscribe((value) => {
      this.queryParams['mascotas'] = value;
    });

    this.filtro_form.get('solo_familia').valueChanges.subscribe((value) => {
      this.queryParams['solo_familia'] = value;
    });

    this.filtro_form
      .get('aire_acondicionado')
      .valueChanges.subscribe((value) => {
        this.queryParams['aire_acondicionado'] = value;
      });

    this.filtro_form.get('parilla').valueChanges.subscribe((value) => {
      this.queryParams['parilla'] = value;
    });

    this.filtro_form.get('serv_limpieza').valueChanges.subscribe((value) => {
      this.queryParams['serv_limpieza'] = value;
    });

    this.filtro_form.get('apto_eventos').valueChanges.subscribe((value) => {
      this.queryParams['apto_eventos'] = value;
    });
  }

  // La siguiente función se encargará de crear el formgroup que controlará cada uno de los controles del formulario
  crearFormulario(): void {
    this.filtro_form = this._fb.group({
      // Filtros básicos
      ubicacion: ['', Validators.required],
      propiedad: ['quinta', Validators.required],
      huespedes: [0, Validators.required],
      dormitorios: [0, Validators.required],
      banos: [0, Validators.required],
      // Filtros básicos

      // Filtros detalles & Servicios
      internet: [''],
      piscina: [''],
      tv: [''],
      seguridad: [''],

      mascotas: [''],
      solo_familia: [''],
      aire_acondicionado: [''],
      parilla: [''],
      serv_limpieza: [''],
      apto_eventos: [''],

      // Filtros detalles & Servicios
    });
  }

  guardarFormulario() {
    let queryParams = this.queryParams;

    // Si el formulario es válido, procederé a navegar nuevamente hacia la misma página pero enviando nuevos querys para filtrar los resultados.
    if (this.filtro_form.valid) {
      this._router.navigate(['/busqueda'], {
        queryParams,
      });
    }

    this.cerrarSidenav.emit(false);
  }

  /* Las siguiente dos funciones gestionarán el incremento en los range-number inputs*/
  incrementarInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.filtro_form.get(Object.keys(caracteristica)[0]).value;

    // Creo un objeto que pasaré al FormGroup
    let objeto = {};
    // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
    objeto[Object.keys(caracteristica)[0]] = valor + 1;

    // Actualizo el valor almacenado en el formGroup
    this.filtro_form.patchValue(objeto);
  }

  reducirInput(caracteristica: object) {
    // Obtengo el valor almacenado en el formGroup.
    let valor = this.filtro_form.get(Object.keys(caracteristica)[0]).value;

    if (valor > 0) {
      // Creo un objeto que pasaré al FormGroup
      let objeto = {};
      // Agrego una nueva propiedad al objeto que será la caracteristica que envié desde la vista.
      objeto[Object.keys(caracteristica)[0]] = valor - 1;

      // Actualizo el valor almacenado en el formGroup
      this.filtro_form.patchValue(objeto);
    }
  }
}
