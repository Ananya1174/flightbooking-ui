import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // store this on login

  if (token && role === 'ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};