import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';
import { Book } from './book/book';
import { Home } from './home/home';
import { BookingsComponent } from './bookings/bookings';
import { Profile } from './profile/profile';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AddFlightComponent } from './add-flight/add-flight';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login,canActivate: [loginGuard] },
  { path: 'register', component: Register ,canActivate: [loginGuard]},
  { path: 'search', component: FlightSearchComponent },

  {
    path: 'bookings',
    component: BookingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book/:flightId',
    component: Book,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },

  {
    path: 'admin/add-flight',
    component: AddFlightComponent,
    canActivate: [adminGuard],
  },

  { path: '**', redirectTo: '' },
];