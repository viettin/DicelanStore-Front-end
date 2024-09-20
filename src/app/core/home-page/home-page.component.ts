import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ButtonModule } from "primeng/button";
import { SharedCommonModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})


export class HomePageComponent {
  products: Product[] = [];
  productPairs: Product[][] = [];
  itemsPerSlide = 4;
  singleSlideOffset = true;
  noWrap = true;
  responsiveOptions = [
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
];
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getListProducts();
  }

  private getListProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      for (let i = 0; i < this.products.length; i += 2) {
        this.productPairs.push(this.products.slice(i, i + 2));
      }
        console.log("🚀 ~ HomePageComponent ~ this.productService.getProducts ~ this.productPairs:", this.productPairs)
    });
  }
}
