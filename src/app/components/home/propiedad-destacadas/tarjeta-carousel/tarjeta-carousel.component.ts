import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-tarjeta-carousel',
  templateUrl: './tarjeta-carousel.component.html',
  styleUrls: ['./tarjeta-carousel.component.css'],
})
export class TarjetaCarouselComponent implements OnInit {
  @Input() propiedad: any = {};

  constructor() {}

  ngOnInit(): void {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
