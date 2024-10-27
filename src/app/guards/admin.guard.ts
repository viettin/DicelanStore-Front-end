import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { getUser, isLoggedIn } from '../store/selectors/auth.selectors';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(getUser).pipe(
    map(user => {
      if (user && user.role === 'Admin') {
        return true;
      } else {
        // Redirect to home page or show an error message
        return router.createUrlTree(['/']);
      }
    })
  );
};

export const userGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);
  
    return store.select(isLoggedIn).pipe(
      map(isLogged => {
          console.log("🚀 ~ isLogged:", isLogged)
        if (isLogged) {
          return true;
        } else {
          // Redirect to home page or show an error message
          return router.createUrlTree(['/']);
        }
      })
    );
  };
