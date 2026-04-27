import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {

  // if(inject(AuthService).isUserAuthenticated()) {
  //   inject(Router).navigate(['/']);
  //   return true;
  // } else {
  //   inject(Router).navigate(['/login']);
  //   return false;
  // }

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserAuthenticated().pipe(
    map((response) => {
      console.log('API Response:', response); // Debugging log
      if (response) {
        return true; // User is authenticated, allow access
      } else {
        console.log('User is not authenticated, redirecting to login');
        router.navigate(['/login']); // Redirect to login
        return false; // Block access
      }
    }),
    catchError((error) => {
      console.error('API Error: Failed to check authentication', error);
      router.navigate(['/login']); // Redirect to login
      return of(false); // Block access
    })
  );

};
