import { Component } from '@angular/core';
import { SharedCommonModule } from '../../../shared/shared.module';
import {
  Table,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { OrderService } from '../../../services/order.service';
import { Store } from '@ngrx/store';
import { getUser, isLoggedIn } from '../../../store/selectors/auth.selectors';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  user: any;
  isLoggedIn: boolean = false;
  searchValue: string = '';
  orders: any[] = [];
  expandedRows = {};
  constructor(private orderService: OrderService, private store: Store) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.select(isLoggedIn).subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.store.select(getUser).subscribe((user) => (this.user = user));
        this.getOrderByRole()
      }
    });
    
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getOrderByRole(){
    if(this.user.role ==="Admin"){
      this.orderService.getOrders().subscribe((orders) => (this.orders = orders));
      return
    }
    this.orderService.getOrder().subscribe((orders) => (this.orders = orders));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  editOrder(_t50: any) {
    throw new Error('Method not implemented.');
  }

  onRowExpand(event: TableRowExpandEvent) {}

  onRowCollapse(event: TableRowCollapseEvent) {}

  expandAll() {
    this.expandedRows = this.orders.reduce(
      (acc, p) => (acc[p.id] = true) && acc,
      {}
    );
  }

  totalProducts(products: any[]): number {
    return products.reduce((total, product) => total + product.quantity, 0);
  }

  getAddress(product: any): string {
    return `${product.street} ${product.ward} ${product.district} ${product.province}`;
  }
  createdDate(date: any): string {
    const a = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate: string = a.toLocaleDateString(undefined, options);
    console.log(
      '🚀 ~ OrderListComponent ~ createdDate ~ formattedDate:',
      formattedDate
    );
    return formattedDate;
  }

  collapseAll() {
    this.expandedRows = {};
  }
}
