import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css'],
})
export class NavbarMobileComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  limpiarStorage() {
    this.auth.logout();
    localStorage.removeItem('user_ex');
  }
}
