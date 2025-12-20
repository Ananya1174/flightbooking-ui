import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';
import { Book } from './book/book';
import { Home } from './home/home';
import { BookingsComponent } from './bookings/bookings';

export const routes: Routes = [
  {  path: '', component: Home},
  { path: 'bookings', component: BookingsComponent },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'search', component: FlightSearchComponent },

  // Dynamic route
  { path: 'book/:flightId', component: Book },

  // Optional: fallback route
  { path: '**', redirectTo: 'login' }
];