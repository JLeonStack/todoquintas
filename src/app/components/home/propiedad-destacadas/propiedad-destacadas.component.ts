import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propiedad-destacadas',
  templateUrl: './propiedad-destacadas.component.html',
  styleUrls: ['./propiedad-destacadas.component.css']
})
export class PropiedadDestacadasComponent implements OnInit {

  numbers: string[] = ['1','2','3','4','5','6','7']
  constructor() { }

  ngOnInit(): void {
  }

}
