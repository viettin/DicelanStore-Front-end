import { Component } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedCommonModule } from '../../shared/shared.module';
import { ProductService } from '../../services/product.service';
import { Store } from '@ngrx/store';
import { OrderService } from '../../services/order.service';
import { addToCartSuccess } from '../../store/actions/order.actions';
import { isLoggedIn } from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  product!: Product;
  quantity: number = 1;
  isLoggedIn: boolean = false;
  images: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private store: Store,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetail(+productId);
    }

    this.store.select(isLoggedIn).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
  }

  fetchProductDetail(id: number) {
    this.productService.getProduct(id).subscribe((data) => {
      this.product = data;
      this.images = data.images;
    });
  }

  getPrice() {
    return this.product.price - (this.product.price * this.product['discount']) / 100;
  }
  addToCart() {
    console.log("🚀 ~ ProductDetailComponent ~ addToCart ~ addToCart:")
    if (this.isLoggedIn) {
      this.orderService.addToCart(this.product.id, this.quantity).subscribe(
        () => {
          this.store.dispatch(addToCartSuccess({ product : this.product as Product }));
        },
      );
    } else {
      let previousUrl = this.router.routerState.snapshot.url;
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: previousUrl },
      });
    }
  }
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity() {
    if (this.quantity < 50) {
      this.quantity++;
    }
  }
}
