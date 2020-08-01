import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-propiedad-b',
  templateUrl: './tarjeta-propiedad-b.component.html',
  styleUrls: ['./tarjeta-propiedad-b.component.css']
})
export class TarjetaPropiedadBComponent implements OnInit {

  @Input() propiedad: any = {}
  
  constructor() { }

  ngOnInit(): void {
  }

  numSequence(n: number): Array<number> { 
    return Array(n); 
  } 

}
