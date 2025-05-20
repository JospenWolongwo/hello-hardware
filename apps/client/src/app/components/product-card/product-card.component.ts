import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../shared/types';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Output() wishlistToggle = new EventEmitter<string>();
  @Output() reserveClick = new EventEmitter<string>();

  defaultImage = 'assets/images/products/placeholder.png';

  constructor(library: FaIconLibrary, private router: Router) {
    library.addIconPacks(fab, fas, far);
  }

  ngOnInit(): void {
    // Ensure product has all required properties to avoid template errors
    if (this.product.price === undefined || this.product.price === null) {
      this.product.price = 0;
    }
    if (!this.product.currency) {
      this.product.currency = 'XAF';
    }
  }

  // Simple getter for image source with fallback
  get imageSrc(): string {
    return this.product.imageUrl || this.defaultImage;
  }

  // Handle image loading error
  onImageError(): void {
    this.product.imageUrl = this.defaultImage;
  }

  toggleWishlist(event: MouseEvent): void {
    // Stop click event from propagating to parent (card)
    event.stopPropagation();

    this.product.inWishlist = !this.product.inWishlist;
    this.wishlistToggle.emit(this.product.id);
  }

  onReserveClick(event: MouseEvent): void {
    // Stop click event from propagating to parent (card)
    event.stopPropagation();

    this.reserveClick.emit(this.product.id);
  }

  /**
   * Navigate to product detail page using the product slug
   */
  navigateToProductDetail(): void {
    if (this.product?.slug) {
      this.router.navigate(['/product', this.product.slug]);
    } else if (this.product?.id) {
      // Fallback to ID if slug is not available
      // Silently use ID instead of slug if not available
      this.router.navigate(['/product', this.product.id]);
    }
  }

  getLabelClass(): string {
    if (!this.product.label) {
      return '';
    }
    const label = this.product.label.toLowerCase();

    if (label.includes('sale') || label.includes('off')) {
      return 'label-sale';
    }
    if (label.includes('new') || label.includes('nouveau')) {
      return 'label-nouveau';
    }
    if (label.includes('solde')) {
      return 'label-solde';
    }
    if (label.includes('promo')) {
      return 'label-promo';
    }

    return 'label-discount';
  }
}
