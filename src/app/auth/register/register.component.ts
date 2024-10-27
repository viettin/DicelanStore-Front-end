import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  rePassword: string = '';
  passwordMatched: boolean = false;
  name: string = '';
  street: string = '';
  city: string = '';
  province: string = '';
  ward: string = '';
  zipCode: string = '';
  email: string = '';
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  userRegister(): void {
    let User = {
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.name,
      phoneNumber: '1234567890',
      avatar: null,
      street: this.street,
      city: this.city,
      province: this.province,
      ward: this.ward,
      zipCode: "100000",
    };
    this.authService.createUser(User).subscribe((data) => {
      this.router.navigate(['auth/login'])
    });
  }
  validatePasswords(): void {
    this.passwordMatched =
      this.password !== '' && this.password === this.rePassword;
  }
}
