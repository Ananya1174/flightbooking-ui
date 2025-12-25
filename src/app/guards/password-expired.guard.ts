import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const passwordExpiredGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isPasswordChangeRequired()) {
    router.navigate(['/profile'], {
      queryParams: { forcePasswordChange: true }
    });
    return false;
  }

  return true;
};