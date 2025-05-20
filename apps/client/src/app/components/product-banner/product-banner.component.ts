import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import type { ShowcaseItem } from '../../../shared/types';

@Component({
  selector: 'app-product-banner',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-banner.component.html',
  styleUrl: './product-banner.component.scss',
})
export class ProductBannerComponent {
  @Input() isMobile = false;
  @Input() isTablet = false;

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fab);
  }

  productData: ShowcaseItem[] = [
    {
      id: 1,
      name: 'HP Elite Book',
      description: '840 G7 14" Intel Core i5-10310U 8GB RAM 256GB',
      price: '100000',
      currency: 'XAF',
      imageUrl: '/assets/images/hp-elite-book-card.png',
      tag: "Economiser jusqu'à 100.000 XAF",
    },
  ];
}
