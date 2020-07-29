import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  navbar_desktop:boolean;
  navbar_mobile: boolean;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla. 
  constructor(private _observer: BreakpointObserver) {
    this._observer.observe('(min-width: 768px)').subscribe(result => {
      if(result.matches){
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
        console.log(this.navbar_mobile);

      }else{
        this.navbar_desktop = result.matches;
        this.navbar_mobile = !result.matches;
        console.log(this.navbar_mobile);
      }
  });
  }

  ngOnInit(): void {}
}
