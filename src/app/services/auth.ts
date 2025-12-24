import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private baseUrl = 'http://localhost:8087';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient,private router: Router) {}

  // ✅ REGISTER
  signup(data: any) {
    return this.http.post(
      `${this.baseUrl}/auth-service/auth/signup`,
      data,
      { responseType: 'text' }
    );
  }

  // ✅ LOGIN
  signin(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth-service/auth/signin`,
      data
    );
  }

  // ✅ SAVE TOKEN + ROLE
  saveToken(token: string) {
    localStorage.setItem('token', token);

    const role = this.extractRoleFromToken(token);
    if (role) {
      localStorage.setItem('role', role);
    }

    this.loggedInSubject.next(true);
  }

  // ✅ LOGOUT
  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // ✅ LOGIN STATE
  isLoggedIn() {
    return this.loggedIn$;
  }
  // ✅ AUTH CHECK (used by guards)
isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ JWT ROLE EXTRACTION
  private extractRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload.roles || [];

      if (roles.includes('ROLE_ADMIN')) {
        return 'ADMIN';
      }
      return 'USER';
    } catch {
      return null;
    }
  }

  // ✅ EMAIL FROM TOKEN (already used in your app)
  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.email || null;
    } catch {
      return null;
    }
  }
}