import { Component, OnInit } from '@angular/core';

// Importo los dos componentes que será en body del cuadro de diálogo.
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';

// Importanmos la librería MatDialog que me permitirá utilizar los métodos correspondientes para desplegar un dialog cuando haga click en el botón Términos y condiciones.
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // La siguiente función se encargará de desplejar el cuadro de diálogo correspondiente a los términos y condiciones.
  openDialogTerminos() {

    const dialogRef = this.dialog.open(TerminosCondicionesComponent);

    // Después de cerrar el cuadro de diálogo me subscribo a un evento.
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

   // La siguiente función se encargará de desplejar el cuadro de diálogo correspondiente a la Política de privacidad
  openDialogPrivacidad() {

    const dialogRef = this.dialog.open(PoliticaPrivacidadComponent);

    // Después de cerrar el cuadro de diálogo me subscribo a un evento.

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}

