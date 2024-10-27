import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/shared.module';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getProductsForPayment } from '../../store/selectors/order.selectors';
import { Product } from '../../core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SharedCommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  constructor(
    private orderService: OrderService,
    private store: Store,
    private router: Router
  ) {}
  selectedForPayment: Product[] = []
  provinces: any[] = [];
  selectedProvince: any | undefined;
  districts: any[] = [];
  selectedDistrict: any | undefined;
  wards: any[] = [];
  selectedWard: any | undefined;
  name: string = '';
  email: string = '';
  phoneNumber: string =''
  street: string =''
  paymentMethod: string =''
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.orderService
      .getProvince()
      .subscribe((province) => (this.provinces = province));
    this.store.select(getProductsForPayment).subscribe(items => {
      if(items.length>0){
        this.selectedForPayment = items
        return
      }
    })
  }
  changeProvince($event: any) {
    this.districts = this.selectedProvince.districts
    this.selectedDistrict = undefined
  }

  changeDistrict() {
    this.wards = this.selectedDistrict.wards
    this.selectedWard= undefined
  }
  get totalPrice(): number {
    return this.selectedForPayment.reduce(
      (total, product) =>
        total + product.price * product['quantity'],
      0
    );
  }

  createOrder(){
    let requestBody ={
      total: this.totalPrice,
      paymentMethod: 'Credit Card',
      products: this.selectedForPayment,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      street: this.street,
      ward: this.selectedWard.name,
      district: this.selectedDistrict.name,
      province: this.selectedProvince.name
    };

    this.orderService.createOrder(requestBody).subscribe(res=>{
      this.router.navigate(['/'])
    })
  }
}
