import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.css']
})
export class SearchMobileComponent implements OnInit {

  funcion(){
    console.log("Click");
  }
  constructor() { }

  ngOnInit(): void {
  }

}
