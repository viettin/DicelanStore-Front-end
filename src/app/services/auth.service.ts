import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, catchError, from, map, of, tap, throwError } from 'rxjs';
import { ApiResponse, User } from '../core/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ){
    
  }
  private afAuth = inject(AngularFireAuth);

  // login(email: string, password: string): Observable<firebase.auth.UserCredential> {
  //   return from(this.afAuth.signInWithEmailAndPassword(email, password));
  // }
  login(username: string, password: string): Observable<any> {
    let user = {
      username,
      password
    } // Use the /login endpoint
    return this.http.post<ApiResponse>(`https://localhost:7249/api/user/login`, user)
      .pipe(
        map((response:ApiResponse) => {  
          const decodedToken = this.jwtHelper.decodeToken(response.data.token);
          localStorage.setItem("access_token",response.data.token)
            return {
              user: decodedToken, // Return the first user found
            };
        }),
        catchError((error) => throwError(error))
      );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
  register(username: string, password: string): Observable<any> {
    const apiUrl = 'http://localhost:3000/users';
    const newUser = { username, password, role: 'user' };

    return this.http.post(apiUrl, newUser)
      .pipe(
        map(response => ({
          success: true,
          message: 'User registered successfully',
          user: response
        })),
        catchError(error => throwError(error))
      );
  }

  googleSignIn(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  facebookSignIn(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()));
  }

  createUser(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`https://localhost:7249/api/user/register`,user,{ headers }).pipe(catchError(error=> {
      console.log(error)
      return of(error)
    }
  
  ));
  }

  getUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  updateUser(user: firebase.User, displayName: string): Observable<void> {
    return from(user.updateProfile({ displayName }));
  }

  deleteUser(user: firebase.User): Observable<void> {
    return from(user.delete());
  }
}
