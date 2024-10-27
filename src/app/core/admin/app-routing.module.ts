import { Routes } from "@angular/router";
import { ProductDetailComponent } from "../../products/product-detail/product-detail.component";
import { AdminComponent } from "./admin.component";
import { ProductManagementComponent } from "./product-management/product-management.component";
import { OrderListComponent } from "./order-list/order-list.component";

export const AdminRoutes: Routes = [
  {
    path: '',
    redirectTo:'admin',
    children: [
          {
            path: 'product-management',
            component: ProductManagementComponent
          },
          {
            path: 'order-management',
            component: OrderListComponent
          },
          {
            path: 'admin',
            component: AdminComponent,
          },
      {
        path: '**', // route every undefined route to the root of this feature
        redirectTo: ''
      }
    ],
  },
];