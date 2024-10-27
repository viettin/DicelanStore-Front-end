import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Product } from '../core/models/product.model';
import { SelectItem } from 'primeng/api';

const GET_MATERIALS = 'api/product/materials';
const GET_PRODUCT_TYPES = 'api/product/producttypes';
const GET_ALL_PRODUCT = 'api/product/get-all';
const UPDATE_PRODUCT = 'api/product/update/';
const CREATE_PRODUCT = 'api/product/create';
const DELETE_PRODUCT = 'api/product/delete/';
const RESTORE_PRODUCT = 'api/product/restore/';
const GET_PRODUCT = 'api/product/get/';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7249/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}${GET_ALL_PRODUCT}`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${GET_PRODUCT}${id}`).pipe(map((response) => response.data));;
  }

  getMaterials(): Observable<SelectItem[]> {
    return this.http.get<SelectItem[]>(`${this.apiUrl}${GET_MATERIALS}`);
  }

  getProductTypes(): Observable<SelectItem[]> {
    return this.http.get<SelectItem[]>(`${this.apiUrl}${GET_PRODUCT_TYPES}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}${CREATE_PRODUCT}`, product, {  headers: new HttpHeaders({ 'Accept': 'application/json' }) });
  }

  updateProduct(product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${UPDATE_PRODUCT}${product.id}`, product,{  headers: new HttpHeaders({ 'Accept': 'application/json' }) });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${DELETE_PRODUCT}${id}`);
  }

  restoreProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${RESTORE_PRODUCT}${id}`);
  }
}
