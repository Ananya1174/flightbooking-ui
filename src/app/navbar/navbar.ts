import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = false;

  constructor(private auth: Auth, private router: Router) {
    this.auth.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.auth.signout();
    this.router.navigate(['/login']);
  }
}