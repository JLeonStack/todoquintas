import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor() {}

  public onSubmit() {
    console.log('Click form');
  }
  disableSelect = new FormControl(false);
  ngOnInit(): void {}
}
