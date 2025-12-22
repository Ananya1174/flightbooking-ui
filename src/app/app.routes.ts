import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { FlightSearchComponent } from './flight/search-flight/search-flight';
import { Book } from './book/book';
import { Home } from './home/home';
import { BookingsComponent } from './bookings/bookings';

// ✅ ADD THESE
import { adminGuard } from './guards/admin.guard';
import { AddFlightComponent } from './add-flight/add-flight';

import { authGuard } from './guards/auth.guard';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'search', component: FlightSearchComponent },
  { path: 'bookings', component: BookingsComponent },

  // Dynamic route
  { path: 'book/:flightId', component: Book },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },

  // ✅ ADMIN ONLY ROUTE
  {
    path: 'admin/add-flight',
    component: AddFlightComponent,
    canActivate: [adminGuard]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];