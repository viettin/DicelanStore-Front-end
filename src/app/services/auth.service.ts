import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, from } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);

  login(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  googleSignIn(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  facebookSignIn(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()));
  }

  createUser(user: User): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password || ''));
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
