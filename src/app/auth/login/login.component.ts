import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { login } from '../../store/actions/auth.actions';
import { isLoggedIn } from '../../store/selectors/auth.selectors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  username: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.select(isLoggedIn).subscribe(isLoggedIn => {
      if(isLoggedIn){
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      }
    })
    window.scrollTo(0,0);
  }

  loginWithEmail(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Logged in successfully', userCredential);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!',
        });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Login failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid email or password.',
        });
      },
    });
  }

  onLogin() {
    this.store.dispatch(login({ username: this.username, password: this.password }));
  }

  loginWithGoogle(): void {
    this.authService.googleSignIn().subscribe({
      next: (userCredential) => {
        console.log('Logged in with Google', userCredential);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in with Google!',
        });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Google login failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Google login failed.',
        });
      },
    });
  }

  loginWithFacebook(): void {
    this.authService.facebookSignIn().subscribe({
      next: (userCredential) => {
        console.log('Logged in with Facebook', userCredential);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in with Facebook!',
        });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Facebook login failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Facebook login failed.',
        });
      },
    });
  }
}
