import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { getUser, isLoggedIn } from '../../store/selectors/auth.selectors';
import { loginSuccess } from '../../store/actions/auth.actions';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedCommonModule } from '../../shared/shared.module';
import { getCart } from '../../store/selectors/order.selectors';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, SharedCommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: any;
  isLoggedIn: boolean = false
  cartNumber: number = 0
  items: MenuItem[];
  isAdminRoute: boolean = false;
  constructor(
    public router: Router,
    private store: Store,
  ) {
    this.items = [
      {
          label: 'Đơn hàng',
          command: () => {
            this.order();
        }
      },
      {
          label: 'Đổi Mật Khẩu',
          command: () => {
              this.login();
          }
      },

      { separator: true },
      { label: 'Đăng Xuất', routerLink: ['/fileupload'] }
  ];
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.select(isLoggedIn).subscribe(isLoggedIn => {
      this.isLoggedIn =isLoggedIn
      if(isLoggedIn){
        this.store.select(getUser).subscribe(user => this.user = user)
      }
    })
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isAdminRoute = this.router.url.includes('/admin') || this.router.url.includes('/user');
    });
    this.store.select(getCart).subscribe(cart => {
     this.cartNumber = cart.length
    })
    
  }
  login(){
    this.router.navigate(['/auth/login'])
  }
  order(){
    if(this.user.role === 'Admin' ){
      this.router.navigate(['/admin/order-management'])
      return
    }
    this.router.navigate(['/user/order-management'])
  }
}
