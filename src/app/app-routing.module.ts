import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomePageComponent } from './core/home-page/home-page.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartComponent } from './products/cart/cart.component';
import { AdminComponent } from './core/admin/admin.component';
import { ProductManagementComponent } from './core/admin/product-management/product-management.component';
import { loginGuard } from './services/login.guard';
import { PaymentComponent } from './orders/payment/payment.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrderListComponent } from './core/admin/order-list/order-list.component';
import { adminGuard, userGuard } from './guards/admin.guard';
import { CollectionComponent } from './core/collection/collection.component';

const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'collection/:type', component: CollectionComponent },
  { path: 'user', 
    children:[
      {
        path:"",
        component:AdminComponent,
        children:[
          {
            path:"order-management",
            component:OrderListComponent,
            canActivate:[userGuard]
          }
        ]
      },
      
    ]
   },
  { path: 'admin', 
    children:[
      {
        path:"",
        component:AdminComponent,
        children:[
          {
            path:"product-management",
            component:ProductManagementComponent,
            canActivate:[adminGuard]
          },
          {
            path:"order-management",
            component:OrderListComponent,
            canActivate:[userGuard]
          }
        ]
      },
      
    ]
   },
  { path: 'cart', component: CartComponent },
  { path: 'oder', component: PaymentComponent },
//   { path: 'orders', component: OrdersComponent },
{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }