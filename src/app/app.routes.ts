import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';
import { Book } from './book/book';
import { Home } from './home/home';
import { BookingsComponent } from './bookings/bookings';
import { Profile } from './profile/profile';
import { AddFlightComponent } from './add-flight/add-flight';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { passwordExpiredGuard } from './guards/password-expired.guard';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register, canActivate: [loginGuard] },
  { path: 'forgot-password', component: ForgotPassword, canActivate: [loginGuard] },
{ path: 'reset-password', component: ResetPassword, canActivate: [loginGuard] },

  {
    path: 'search',
    component: FlightSearchComponent,
    canActivate: [authGuard, passwordExpiredGuard],
  },
  {
    path: 'book/:flightId',
    component: Book,
    canActivate: [authGuard, passwordExpiredGuard],
  },
  {
    path: 'bookings',
    component: BookingsComponent,
    canActivate: [authGuard, passwordExpiredGuard],
  },

  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },

  {
    path: 'admin/add-flight',
    component: AddFlightComponent,
    canActivate: [authGuard, adminGuard, passwordExpiredGuard],
  },

  { path: '**', redirectTo: '' },
];