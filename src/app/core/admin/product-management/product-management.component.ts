// product-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import {
  FashionCategory,
  Product,
  ProductStatus,
} from '../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { SharedCommonModule } from '../../../shared/shared.module';
import { UploadEvent } from 'primeng/fileupload';
import { take } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: true,
  imports: [SharedCommonModule],
  providers: [MessageService, ConfirmationService],
})
export class ProductManagementComponent implements OnInit {

  private allProducts: Product[] = [];
  isDeleted: boolean = false;
  searchValue: string = '';
  uploadedFiles: any[] = [];
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productDialog: boolean = false;
  deleteProductDialog: boolean = false;
  productForm: FormGroup;
  categories: { name: string; value: FashionCategory }[] = [
    { name: 'Tops', value: 'tops' },
    { name: 'Bottoms', value: 'bottoms' },
    // ... (rest of the categories)
  ];
  materials: SelectItem[] = [];

  productTypes: any[] = [];

  statuses: { name: string; value: ProductStatus }[] = [
    { name: 'in-stock', value: 'in-stock' },
    { name: 'low-stock', value: 'low-stock' },
    { name: 'out-of-stock', value: 'out-of-stock' },
    // ... (rest of the categories)
  ];

  // Pagination
  first: number = 0;
  rows: number = 10;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      producttypeid: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      stockquantity: [0, [Validators.required, Validators.min(0)]],
      materialid: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.productService
      .getMaterials()
      .subscribe((item) => (this.materials = item));
    this.productService
      .getProductTypes()
      .subscribe((item) => (this.productTypes = item));
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.allProducts = data;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products',
        });
      },
    });
  }

  onBasicUploadAuto(event: UploadEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Auto Mode',
    });
  }

  changeToggle() {
    if (this.isDeleted) {
      // Show all products, including deleted ones
      this.products = [...this.allProducts];
    } else {
      // Filter out deleted products
      this.products = this.allProducts.filter(product => !product['isDeleted']);
    }
  }
  openNew() {
    this.selectedProduct = null;
    this.productForm.reset({ status: 'active' });
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.deleteProductDialog = true;
    this.selectedProduct = product;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.confirmDelete();
      },
    });
  }

  restoreProduct(product: any) {
    this.deleteProductDialog = true;
    this.selectedProduct = product;
    this.confirmationService.confirm({
      message: 'Are you sure you want to restore ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.confirmRestore();
      },
    });
}

  confirmDelete() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe(
        () => {
          this.loadProducts();
        },
      );
    }
  }
  confirmRestore() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.restoreProduct(this.selectedProduct.id).subscribe(
        () => {
          this.loadProducts();
        },
      );
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.productForm.patchValue({
      ...this.selectedProduct,
      materialid: product['materialId'],
      producttypeid: product['productTypeId'],
      stockquantity: product['stockQuantity'],
    });
    this.productDialog = true;
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hideDialog() {
    this.productDialog = false;
    this.productForm.reset();
  }

  saveProduct() {
    if (this.productForm.valid) {
      const formData = new FormData();
      const productData = this.productForm.value;

      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      this.uploadedFiles.forEach((file) => {
        console.log('File uploaded', typeof file);
        formData.append(`images`, file, file.name);
      });

      if (productData.id) {
        this.productService
          .updateProduct(productData)
          .subscribe((updatedProduct) => {
            const index = this.products.findIndex(
              (p) => p.id === updatedProduct.id
            );
            this.products[index] = updatedProduct;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',
              life: 3000,
            });
          });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: (newProduct) => {
            this.products.push(newProduct);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Created',
              life: 3000,
            });
          },
        });
      }
      this.productDialog = false;
      this.selectedProduct = null;
      this.uploadedFiles = []; // Clear uploaded files after saving
    }
    this.loadProducts();
  }

  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.productForm.patchValue({
          image: reader.result,
        });
      };
    }
  }

  onUpload(event: any) {
    // Handle file upload logic here
    this.uploadedFiles = [...this.uploadedFiles, ...event.files];
    console.log('File uploaded', typeof event.files);
    console.log(
      '🚀 ~ ProductManagementComponent ~ onUpload ~ this.uploadedFiles:',
      this.uploadedFiles
    );
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
