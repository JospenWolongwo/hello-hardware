/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import type { FilterCategory } from '../../../shared/interfaces';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatRadioModule, FontAwesomeModule],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent {
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Output() filterChange = new EventEmitter<any>();

  filterCategories: FilterCategory[] = [
    {
      title: 'CATÉGORIES',
      type: 'icon',
      icon: 'fas list',
      options: [
        { name: 'Laptops', value: 'laptops', icon: 'fas laptop' },
        { name: 'Desktops', value: 'desktops', icon: 'fas desktop' },
        { name: 'Tablets', value: 'tablets', icon: 'fas tablet-alt' },
        { name: 'Accessories', value: 'accessories', icon: 'fas headphones' },
      ],
    },
    {
      title: 'TOUTES LES MARQUES',
      type: 'text',
      icon: 'fas tags',
      options: [
        { name: 'Apple', value: 'apple', checked: false },
        { name: 'Dell', value: 'dell', checked: false },
        { name: 'HP', value: 'hp', checked: false },
        { name: 'Lenovo', value: 'lenovo', checked: false },
      ],
    },
    {
      title: 'PRIX',
      type: 'radio',
      options: [
        { name: 'Alle Preise', value: 'all', count: 0, checked: true },
        { name: '0XAF – 500XAF', value: '0-500', count: 0, checked: false },
        { name: '500XAF – 1000XAF', value: '500-1000', count: 0, checked: false },
        { name: '1000XAF – 1500XAF', value: '1000-1500', count: 0, checked: false },
      ],
    },
    {
      title: 'ANNÉE DE PUBLICATION',
      type: 'checkbox',
      options: [
        { name: '2022', value: '2022', count: 1, checked: false },
        { name: '2021', value: '2021', count: 9, checked: false },
        { name: '2020', value: '2020', count: 37, checked: false },
        { name: '2019', value: '2019', count: 41, checked: false },
        { name: '2018', value: '2018', count: 6, checked: false },
      ],
    },
    {
      title: "TAILLE DE L'ÉCRAN",
      type: 'checkbox',
      options: [
        { name: '15.6"', value: '15.6', count: 34, checked: false },
        { name: '14"', value: '14', count: 58, checked: false },
        { name: '13.3"', value: '13.3', count: 2, checked: false },
      ],
    },
    {
      title: 'SYSTÈME OPÉRATEUR',
      type: 'checkbox',
      options: [
        { name: 'macOS', value: 'macos', count: 1, checked: false },
        { name: 'Windows 10 Pro', value: 'win10pro', count: 17, checked: false },
        { name: 'Windows 11 Pro', value: 'win11pro', count: 76, checked: false },
      ],
    },
    {
      title: 'PROCESSEUR',
      type: 'checkbox',
      options: [
        { name: 'Apple M2', value: 'apple-m2', count: 1, checked: false },
        { name: 'Intel i5', value: 'intel-i5', count: 67, checked: false },
        { name: 'Intel i7', value: 'intel-i7', count: 26, checked: false },
      ],
    },
    {
      title: 'R.A.M',
      type: 'checkbox',
      options: [
        { name: '32 GB', value: '32gb', count: 4, checked: false },
        { name: '24 GB', value: '24gb', count: 5, checked: false },
        { name: '16 GB', value: '16gb', count: 56, checked: false },
        { name: '8 GB', value: '8gb', count: 29, checked: false },
      ],
    },
    {
      title: 'ESPACE DE STOCKAGE',
      type: 'checkbox',
      options: [
        { name: '1 TB', value: '1tb', count: 1, checked: false },
        { name: '512 GB', value: '512gb', count: 33, checked: false },
        { name: '256 GB', value: '256gb', count: 60, checked: false },
      ],
    },
    {
      title: 'COULEUR',
      type: 'checkbox',
      options: [
        { name: 'Schwarz', value: 'schwarz', count: 63, checked: false },
        { name: 'Silber', value: 'silber', count: 21, checked: false },
        { name: 'Silber / Schwarz', value: 'silber-schwarz', count: 9, checked: false },
        { name: 'Space Gray', value: 'space-gray', count: 1, checked: false },
      ],
    },
    {
      title: 'RÉSOLUTION',
      type: 'checkbox',
      options: [
        { name: '1920 × 1200', value: '1920x1200-1', count: 63, checked: false },
        { name: '1920 × 1200', value: '1920x1200-2', count: 21, checked: false },
        { name: '1920 × 1200', value: '1920x1200-3', count: 9, checked: false },
        { name: '1920 × 1200', value: '1920x1200-4', count: 1, checked: false },
      ],
    },
    {
      title: 'DISPOSITION DU CLAVIER',
      type: 'checkbox',
      options: [{ name: 'German (QWERTZ)', value: 'qwertz', count: 94, checked: false }],
    },
    {
      title: 'COMMUNICATION',
      type: 'checkbox',
      options: [{ name: 'LTE', value: 'lte', count: 24, checked: false }],
    },
  ];

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }

  parseIcon(iconString: string | undefined): IconProp {
    if (!iconString) {
      return ['fas', 'question'] as IconProp;
    }
    const [prefix, ...nameParts] = iconString.split(' ');
    const name = nameParts[nameParts.length - 1].replace('fa-', '');

    return [prefix as any, name] as IconProp;
  }

  onFilterChange(): void {
    const activeFilters = this.filterCategories.reduce((acc, category) => {
      const selectedOptions = category.options.filter((option) => option.checked).map((option) => option.value);
      if (selectedOptions.length > 0) {
        acc[category.title.toLowerCase()] = selectedOptions;
      }

      return acc;
    }, {} as Record<string, string[]>);

    this.filterChange.emit(activeFilters);
  }
}
