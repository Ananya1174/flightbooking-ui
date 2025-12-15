import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private baseUrl = 'http://localhost:8087';

  // 🔐 Login state
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  signup(data: any) {
    return this.http.post(
      `${this.baseUrl}/auth-service/auth/signup`,
      data,
      { responseType: 'text' }
    );
  }

  signin(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/auth-service/auth/signin`,
      data
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  signout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.loggedIn$;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}