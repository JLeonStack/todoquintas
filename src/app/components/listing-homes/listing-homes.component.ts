import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-listing-homes',
  templateUrl: './listing-homes.component.html',
  styleUrls: ['./listing-homes.component.css']
})
export class ListingHomesComponent implements OnInit {

  // Estas variables del tipo booleanas me permitirán mostrar o no las diferentes secciones según el tamaño de la pantalla.
  navbar_desktop:boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla. 
  constructor(private _observer: BreakpointObserver) {
    this._observer.observe('(min-width: 768px)').subscribe(result => {
      if(result.matches){
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;

      }else{
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
      }
  });
  }

  ngOnInit(): void {
  }

}
