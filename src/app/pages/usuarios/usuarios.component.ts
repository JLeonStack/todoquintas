import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userProfile$.subscribe((data) => {
      console.log(data);
    });
  }
}
