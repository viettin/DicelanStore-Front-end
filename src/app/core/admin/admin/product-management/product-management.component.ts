// product-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FashionCategory, Product, ProductStatus } from '../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { SharedCommonModule } from '../../../../shared/shared.module';
import { UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: true,
  imports: [SharedCommonModule],
  providers:[MessageService, ConfirmationService ]
})
export class ProductManagementComponent implements OnInit {
  
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productDialog: boolean = false;
  deleteProductDialog: boolean = false;
  productForm: FormGroup;
  categories: {name: string, value: FashionCategory}[] = [
    { name: 'Tops', value: 'tops' },
    { name: 'Bottoms', value: 'bottoms' },
    // ... (rest of the categories)
  ];

  statuses: {name: string, value: ProductStatus}[] = [
    { name: 'in-stock', value: 'in-stock' },
    { name: 'low-stock', value: 'low-stock' },
    { name: 'out-of-stock', value: 'out-of-stock' },
    // ... (rest of the categories)
  ];

  
  // Pagination
  first: number = 0;
  rows: number = 10;
  
  // Filtering
  categoryFilter: string = '';
  priceRangeFilter: number[] = [0, 1000];
  statusFilter: string = '';
  
  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['active', Validators.required],
      description: [''],
      image: [null]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load products'});
      }
    );
  }

  onBasicUploadAuto(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
}
  openNew() {
    this.selectedProduct = null;
    this.productForm.reset({status: 'active'});
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.deleteProductDialog = true;
    this.selectedProduct = product;
  }

  confirmDelete() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe(
        () => {
          this.products = this.products.filter(val => val.id !== this.selectedProduct?.id);
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
          this.deleteProductDialog = false;
          this.selectedProduct = null;
        },
        (error) => {
          console.error('Error deleting product', error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete product'});
        }
      );
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.productForm.patchValue(this.selectedProduct);
    this.productDialog = true;
  }
  hideDialog() {
    this.productDialog = false;
    this.productForm.reset();
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (productData.id) {
        this.productService.updateProduct(productData).subscribe(
          (updatedProduct) => {
            const index = this.products.findIndex(p => p.id === updatedProduct.id);
            this.products[index] = updatedProduct;
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
          },
          (error) => {
            console.error('Error updating product', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to update product'});
          }
        );
      } else {
        this.productService.createProduct(productData).subscribe(
          (newProduct) => {
            this.products.push(newProduct);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
          },
          (error) => {
            console.error('Error creating product', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to create product'});
          }
        );
      }
      this.productDialog = false;
      this.selectedProduct = null;
    }
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUpload(event: any) {
    // Handle file upload logic here
    console.log('File uploaded', event.files);
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'low stock':
        return 'warning';
      default:
        return 'info';
    }
  }
}