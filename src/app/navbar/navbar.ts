import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import { Logout } from '../logout/logout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Logout],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = false;
  showLogoutDialog = false;

  constructor(private auth: Auth, private router: Router) {
    this.auth.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  openLogoutDialog() {
    this.showLogoutDialog = true;
  }

  cancelLogout() {
    this.showLogoutDialog = false;
  }

  confirmLogout() {
    this.auth.signout();
    this.showLogoutDialog = false;
    this.router.navigate(['/login']);
  }
}