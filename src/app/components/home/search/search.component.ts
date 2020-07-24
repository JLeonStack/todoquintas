import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor() {}
  disableSelect = new FormControl(false);
  options: string[] = ['Angular', 'Vue', 'React'];
  ngOnInit(): void {}
}
