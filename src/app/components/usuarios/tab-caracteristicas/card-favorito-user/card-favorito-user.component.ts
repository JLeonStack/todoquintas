import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-favorito-user',
  templateUrl: './card-favorito-user.component.html',
  styleUrls: ['./card-favorito-user.component.css'],
})
export class CardFavoritoUserComponent implements OnInit {
  @Input() propiedad: any = {};

  constructor() {}

  ngOnInit(): void {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
