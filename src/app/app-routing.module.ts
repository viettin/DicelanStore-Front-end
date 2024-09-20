import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomePageComponent } from './core/home-page/home-page.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductManagementComponent } from './core/admin/admin/product-management/product-management.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'products', component: ProductDetailComponent },
  { path: 'admin/product-management', component: ProductManagementComponent },
//   { path: 'orders', component: OrdersComponent },
{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
