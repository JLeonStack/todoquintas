import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.css']
})
export class NumberSpinnerComponent implements OnInit {
  
  // La siguiente variable se encargará de llevar el conteo del input number spinner
  valorInput: number = 0;

  incrementarInput(){
    this.valorInput++;
  }

  reducirInput(){
    if(this.valorInput > 0){
      this.valorInput--;
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
