import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-p-carousell-main',
  templateUrl: './p-carousell-main.component.html',
  styleUrls: ['./p-carousell-main.component.css'],
})
export class PCarousellMainComponent implements OnInit, OnChanges {
  @Input() imagenes_propiedad;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
    if (this.imagenes_propiedad) {
      console.log(this.imagenes_propiedad['img_f']);
    }
  }
  ngOnInit(): void {}
}
