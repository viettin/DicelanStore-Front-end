import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Order } from '../core/models/order.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const API_URL = environment.apiURL;
const ADD_TO_CART = 'api/user/cart/add';
const GET_CART = 'api/user/cart';
const CREATE_ORDER = 'api/order/create';
const GET_USER_ORDER = 'api/order/user-orders';
const GET_ORDERS = 'api/order/all-orders';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient,
    private router: Router,
  ) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(`${API_URL}${GET_ORDERS}`).pipe(map(res => res.data));
  }

  getOrder(): Observable<any> {
    return this.http.get<any>(`${API_URL}${GET_USER_ORDER}`).pipe(map(res => res.data));
  }
  
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${API_URL}${CREATE_ORDER}`, order);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${API_URL}/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  addToCart(id: number, count: number): Observable<any> {
    let requestBody = {
      productId: id,
      quantity: count
    }
    return this.http.post<any>(`${API_URL}${ADD_TO_CART}`,requestBody);
  }

  getCart(): Observable<any> {
    return this.http.get<any>(`${API_URL}${GET_CART}`).pipe(map((response) => response.data));
  }

  getProvince(): Observable<any> {
    let api = 'https://provinces.open-api.vn/api/?depth=3'
    return this.http.get<any>(`${api}`).pipe(map((response) => response));
  }
}
