import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../models/product.model';
import { SharedCommonModule } from '../../shared/shared.module';
import { ProductCardComponent } from '../../products/product-card/product-card.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [SharedCommonModule, ProductCardComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit {
  collectionType: string | null = null;
  products: any[] = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.collectionType = params.get('type');
      console.log("🚀 ~ CollectionComponent ~ ngOnInit ~ this.collectionType:", this.collectionType)
      if (this.collectionType) {
        this.updatePageTitle(this.collectionType);
        this.getListProducts()
      } else {
        this.router.navigate(['/']);
      }
    });

    
  }

  private updatePageTitle(type: string) {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    this.titleService.setTitle(`${formattedType} Collection`);
  }

  private getListProducts() {
    this.products = []
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data.filter(item => !item['isDeleted']);
    });
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    this.sortProducts(selectedValue);
  }
  private sortProducts(sortBy: string) {
    switch (sortBy) {
      case 'price-ascending':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-descending':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'title-ascending':
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'title-descending':
        this.products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'created-ascending':
        this.products.sort((a, b) => a.createdDate.localeCompare(b.createdDate));
        break;
      case 'created-descending':
        this.products.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
        break;
      case 'best-selling':
        this.products.sort((a, b) => b.soldQuantity - a.soldQuantity);
        break;
      case 'quantity-descending':
        this.products.sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        // No sorting
        break;
    }
  }
}
