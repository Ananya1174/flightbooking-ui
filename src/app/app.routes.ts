import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: FlightSearchComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
