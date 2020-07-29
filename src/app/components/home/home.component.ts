import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  navbar:boolean = true;

  // BreakpointObserver se encargará de observar el tamaño de la pantalla en todo momento y evaluar los cambios que se producen. Esto me permitirá poder mostrar/ocultar elementos en base al tamaño de pantalla. 
  constructor(private _observer: BreakpointObserver) {
    this._observer.observe('(min-width: 700px)').subscribe(result => {
      console.log(result);
      this.navbar = !this.navbar;
  });
  }

  ngOnInit(): void {}
}
