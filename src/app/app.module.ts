import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { appReducer } from './store/app.state';
import { ProductsEffects } from './store/effects/product.effects';
import { AuthEffects } from './store/effects/auth.effects';
import { OrdersEffects } from './store/effects/order.effects';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedCommonModule } from './shared/shared.module';
import { HeaderComponent } from "./core/header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from './core/footer/footer.component';
import { provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
    // other components if needed
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([ProductsEffects, AuthEffects, OrdersEffects]),
    AppRoutingModule,
    SharedCommonModule,
    CommonModule
    // other modules if needed
    ,
    HeaderComponent,
    FooterComponent
],
  providers: [provideAnimations()],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
