import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service'; // Your Auth Service
import { Store } from '@ngrx/store';
import { loginSuccess } from '../store/actions/auth.actions';


export const loginGuard: CanActivateFn = () => {
  const jwtHelper = inject(JwtHelperService);
  const router = inject(Router);
  const store = inject(Store)

  const token = localStorage.getItem("accessToken");

  // If token is not present or expired, stay on the login page
  if (!token || jwtHelper.isTokenExpired(token)) {
    return true;  // Allow access to the login page
  }
  const decodedToken = jwtHelper.decodeToken(token);
  console.log("🚀 ~ decodedToken:", decodedToken)
  store.dispatch(loginSuccess({user: decodedToken}))
  // If the token is valid, redirect to the home page
  router.navigate(['/']);
  return true;  // Block access to the login page
};

