import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private messageService: MessageService) {}

  loginWithEmail(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Logged in successfully', userCredential);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully!' });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Login failed', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password.' });
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.googleSignIn().subscribe({
      next: (userCredential) => {
        console.log('Logged in with Google', userCredential);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in with Google!' });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Google login failed', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Google login failed.' });
      }
    });
  }

  loginWithFacebook(): void {
    this.authService.facebookSignIn().subscribe({
      next: (userCredential) => {
        console.log('Logged in with Facebook', userCredential);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in with Facebook!' });
        // Handle successful login (e.g., redirect)
      },
      error: (error) => {
        console.error('Facebook login failed', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Facebook login failed.' });
      }
    });
  }
}
