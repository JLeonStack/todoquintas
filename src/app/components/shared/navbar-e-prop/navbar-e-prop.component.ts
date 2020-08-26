import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar-e-prop',
  templateUrl: './navbar-e-prop.component.html',
  styleUrls: ['./navbar-e-prop.component.css'],
})
export class NavbarEPropComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  limpiarStorage() {
    this.auth.logout();
    localStorage.removeItem('user_ex');
  }
}
