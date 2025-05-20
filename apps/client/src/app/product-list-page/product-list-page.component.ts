import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import type { Product, Screen, ScreenSize } from '../../shared/types';
import { SCREEN_SIZES } from '../../shared/utils';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { NewsletterComponent } from '../components/newsletter/newsletter.component';
import { ProductBannerComponent } from '../components/product-banner/product-banner.component';
import { ProductFilterComponent } from '../components/product-filter/product-filter.component';
import { ProductsSliderComponent } from '../components/products-slider/products-slider.component';
import { ProductService } from '../services/product.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-product-list-page',
  host: {
    class: 'w-100 flex-col align-items-center',
  },
  standalone: true,
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
  imports: [
    CommonModule,
    NewsletterComponent,
    FeedbackComponent,
    ProductsSliderComponent,
    ProductFilterComponent,
    ProductBannerComponent,
  ],
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  currentScreenSize: ScreenSize = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    ltSm: false,
    ltMd: false,
    ltLg: false,
    ltXl: false,
    gtXs: false,
    gtSm: false,
    gtMd: false,
    gtLg: false,
  };

  products: Product[] = [];
  filteredProducts: Product[] = [];
  activeCategory = '';
  activeFilters: Record<string, string[]> = {};
  isFilterPopupOpen = false;
  isLoading = true;

  // eslint-disable-next-line max-params
  constructor(
    private responsive: BreakpointObserver,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Observe screen sizes
    const screenSizes: Screen[] = ['ltSm', 'ltLg'];
    screenSizes.forEach((screenSize) => {
      this.subscription.add(
        this.responsive.observe([SCREEN_SIZES[screenSize]]).subscribe((state) => {
          this.currentScreenSize[screenSize] = state.matches;
        })
      );
    });

    // Get category from route
    this.route.data.subscribe((data) => {
      const routeCategory = data['category'] || '';
      // Map route categories to existing product categories
      // Using more flexible mapping to match product data
      const categoryMap: Record<string, string> = {
        Laptops: 'Laptop',
        Telephones: 'Telephone',
        Tablets: 'Tablet',
        'Ecran Plat': 'Ecran',
      };
      this.activeCategory = categoryMap[routeCategory] || routeCategory;
      this.loadProductsByCategory();
    });

    this.subscription.add(
      this.wishlistService.getWishlistItems().subscribe((wishlistItems) => {
        const wishlistProductIds = wishlistItems.map((item) => item.product.id);

        if (this.products.length > 0) {
          this.products.forEach((product) => {
            product.inWishlist = wishlistProductIds.includes(product.id);
          });
          this.filteredProducts = [...this.products];
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProductsByCategory(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe({
      next: (allProducts) => {
        const categoryMatches = allProducts.filter((product) => {
          const productCategory = (product.categoryName || '').toLowerCase();
          const categoryName = (product.category?.name || '').toLowerCase();
          const activeCategory = this.activeCategory.toLowerCase();

          return (
            productCategory.includes(activeCategory) ||
            categoryName.includes(activeCategory) ||
            activeCategory.includes(productCategory) ||
            activeCategory.includes(categoryName)
          );
        });

        if (categoryMatches && categoryMatches.length > 0) {
          this.products = categoryMatches.map((product) => ({
            ...product,
            imageUrl: product.gallery || product.imageUrl || 'assets/images/products/placeholder.png',
            inStock: product.inStock ?? true,
            inWishlist: false,
            categoryName: this.activeCategory, // Ensure categoryName is set
          }));
          this.filteredProducts = [...this.products];
        } else {
          // If no products found for the category, show a message
          this.products = [];
          this.filteredProducts = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.filteredProducts = [];
        this.isLoading = false;
      },
    });
  }

  onFilterChange(filters: Record<string, string[]>): void {
    this.activeFilters = filters;

    if (Object.keys(filters).length === 0) {
      this.filteredProducts = [...this.products];

      return;
    }

    // Apply filters
    this.filteredProducts = this.products.filter(() => {
      // Replace with actual product filtering logic
      return true;
    });
  }

  toggleFilterPopup(): void {
    this.isFilterPopupOpen = !this.isFilterPopupOpen;
  }

  onWishlistToggle(productId: string): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.wishlistService.toggleWishlistItem(product);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onReserveClick(productId: string): void {
    // Handle reserve functionality
  }
}
