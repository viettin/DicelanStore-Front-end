import { Component, Input } from '@angular/core';
import { SharedCommonModule } from '../../shared/shared.module';
import { Store } from '@ngrx/store';
import { addToCart, addToCartSuccess } from '../../store/actions/order.actions';
import { isLoggedIn } from '../../store/selectors/auth.selectors';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../core/models/product.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  constructor(
    private store: Store,
    private router: Router,
    private orderService: OrderService
  ) {}
  @Input() product: any;

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.select(isLoggedIn).subscribe((item) => (this.isLoggedIn = item));
  }
  getPrice(product: any) {
    return product.price - (product.price * product.discount) / 100;
  }

  addToCart(product: any) {
    if (this.isLoggedIn) {
      this.orderService.addToCart(product.id, 1 ).subscribe(
        (response: any) => {
          this.store.dispatch(addToCartSuccess({ product }));
        },
        (error:any) => {
          console.error('Error adding product to cart:', error);
        }
      );
    } else {
      let previousUrl = this.router.routerState.snapshot.url
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: previousUrl } });
    }
  }

}
