import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';
import { Book } from './book/book';
import { Home } from './home/home';

export const routes: Routes = [
  {  path: '', component: Home},

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'search', component: FlightSearchComponent },

  // Dynamic route
  { path: 'book/:flightId', component: Book },

  // Optional: fallback route
  { path: '**', redirectTo: 'login' }
];