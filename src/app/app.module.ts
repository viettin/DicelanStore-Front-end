import { CUSTOM_ELEMENTS_SCHEMA, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { AppLoadingInterceptor } from './interceptors/app-loader.interceptor';
import { MessageService } from 'primeng/api';
export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  {provide: HTTP_INTERCEPTORS, useClass: AppLoadingInterceptor, multi: true},
];
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
    CommonModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    HeaderComponent,
    FooterComponent
],
  providers: [
    provideAnimations(),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    httpInterceptorProviders,
    MessageService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
