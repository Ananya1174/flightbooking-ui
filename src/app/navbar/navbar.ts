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
  isAdmin = false;
  showLogoutDialog = false;

  constructor(private auth: Auth, private router: Router) {

    // React to login/logout
    this.auth.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;

      // update admin flag whenever login status changes
      if (status) {
        this.isAdmin = localStorage.getItem('role') === 'ADMIN';
      } else {
        this.isAdmin = false;
      }
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