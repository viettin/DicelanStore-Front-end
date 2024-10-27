import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedCommonModule } from '../../shared/shared.module';
import { Product } from '../../core/models/product.model';
import { Store } from '@ngrx/store';
import { getCart } from '../../store/selectors/order.selectors';
import { OrderService } from '../../services/order.service';
import { isLoggedIn } from '../../store/selectors/auth.selectors';
import { Router } from '@angular/router';
import * as OrderActions from "../../store/actions/order.actions"

interface ProductGroup {
  name: string;
  products: Product[];
}
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent {
  productGroups: any[] = [];
  userNote: string = '';
  cart: any[] = []
  selectedProducts: any[] = []
  constructor(
    private store: Store,
    private orderService: OrderService,
    private router: Router
  ){

  }
  ngOnInit() {
    // Initialize with sample data
    this.store.select(isLoggedIn).subscribe(isLoggedIn => {
      if(!isLoggedIn){
        let previousUrl = this.router.routerState.snapshot.url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: previousUrl } });
      }
    })
    this.orderService.getCart().subscribe(cartItems => this.cart = cartItems)
    this.store.select(getCart).subscribe(cart => {
      const productMap = new Map<string, any>();
      cart.forEach(product => {
        const key = `${product.id}`; // Assuming each product has a unique id
        if (productMap.has(key)) {
          productMap.get(key).count++;
        } else {
          productMap.set(key, { ...product, count: 1 });
        }
      });
      this.cart = Array.from(productMap.values());
    });
  }

  get totalProducts(): number {
    return this.cart.reduce(
      (total, product) =>
        total + product.quantity,
      0
    );
  }

  get totalPrice(): number {
    return this.selectedProducts.reduce(
      (total, product) =>
        total + product.price * product.quantity,
      0
    );
  }

  updateQuantity(product: any, newQuantity: any): void {
    product.quantity = newQuantity;
  }

  removeProduct(groupIndex: number, productIndex: number): void {
    this.productGroups[groupIndex].products.splice(productIndex, 1);
    if (this.productGroups[groupIndex].products.length === 0) {
      this.productGroups.splice(groupIndex, 1);
    }
  }

  continueShopping(): void {
    // Logic to navigate back to the shopping page
    console.log('Continuing shopping...');
  }

  redirectToPayment(): void {
    if (this.selectedProducts.length > 0) {
      // Dispatch the new action with selected products
      this.store.dispatch(OrderActions.proceedToPayment({ selectedProducts: this.selectedProducts }));
      this.router.navigate(['/oder']);
    } else {
      console.log('Please select products before proceeding to payment');
    }
  }
}
