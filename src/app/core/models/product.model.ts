export interface Product {
  id: number;
  name: string;
  description?: string;
  category: FashionCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string;
  firstimage?: string;
  [index: string]: any;
}
export type FashionCategory = 
  'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'footwear' | 
  'accessories' | 'underwear' | 'activewear' | 'swimwear' | 
  'formal-wear' | 'sleepwear' | 'vintage' | 'sustainable' | 
  'plus-size' | 'jewelry';

  export type ProductStatus = 
  'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued' | 
  'coming-soon' | 'sale' | 'new-arrival' | 'back-order';