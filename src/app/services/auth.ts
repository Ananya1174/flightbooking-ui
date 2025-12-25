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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ================= REGISTER =================
  signup(data: any) {
    return this.http.post(
      `${this.baseUrl}/auth-service/auth/signup`,
      data,
      { responseType: 'text' }
    );
  }

  // ================= LOGIN =================
  signin(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth-service/auth/signin`,
      data
    );
  }

  // ================= SAVE TOKEN + FLAGS =================
  saveToken(token: string) {
    localStorage.setItem('token', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // ✅ SAVE ROLE
      const roles: string[] = payload.roles || [];
      localStorage.setItem(
        'role',
        roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'
      );

      // ✅ SAVE PASSWORD EXPIRY FLAG
      if (payload.pwd_expired !== undefined) {
        localStorage.setItem(
          'passwordChangeRequired',
          String(payload.pwd_expired)
        );
      }

    } catch (e) {
      console.error('Invalid JWT payload', e);
    }

    this.loggedInSubject.next(true);
  }

  // ================= PASSWORD EXPIRY CHECK =================
  isPasswordChangeRequired(): boolean {
    return localStorage.getItem('passwordChangeRequired') === 'true';
  }

  // ================= LOGOUT =================
  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('passwordChangeRequired');

    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // ================= AUTH STATE =================
  isLoggedIn() {
    return this.loggedIn$;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ================= EMAIL FROM TOKEN =================
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