import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

/**
 * Interface for promotion items displayed in the banner
 * @property id - Unique identifier and CSS class for the promotion item
 * @property title - Main title of the promotion (e.g., brand name)
 * @property tagline - Secondary title/subtitle (e.g., product model)
 * @property price - Price of the product (optional, empty string if not displayed)
 * @property currency - Currency code (optional, empty string if price not displayed)
 * @property label - Label text displayed on the banner (e.g., "NEW", "SALE")
 * @property imageUrl - Path to the product image
 * @property link - URL to navigate to when item is clicked
 */
interface PromotionItem {
  id: string;
  title: string;
  tagline: string;
  price: string;
  currency: string;
  label: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-promotion-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promotion-banner.component.html',
  styleUrl: './promotion-banner.component.scss',
})
export class PromotionBannerComponent {
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Input() resultsCount?: number;
  @Input() sortOption = 'Most Popular';

  promotionItems: PromotionItem[] = [
    {
      id: 'speaker',
      title: 'New Apple',
      tagline: 'Homepod Mini',
      price: '',
      currency: '',
      label: 'NOUVEAUX',
      imageUrl: 'assets/images/products/speaker.png',
      link: '/products/category/speakers',
    },
    {
      id: 'phone',
      title: 'Xiaomi Mi 11 Ultra',
      tagline: '12GB+256GB',
      price: '590.000',
      currency: 'XAF',
      label: 'NOUVEAUX',
      imageUrl: 'assets/images/products/telephones.png',
      link: '/products/category/phones',
    },
  ];

  filterCategories: string[] = ['Ordinateurs', 'Téléphones', 'Speakers', 'Montres', 'Cameras'];

  constructor(private router: Router) {}

  navigateToCategory(link: string): void {
    this.router.navigateByUrl(link);
  }

  applyFilter(category: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category.toLowerCase() },
    });
  }
}
