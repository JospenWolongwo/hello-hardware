import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  @Input() rating: number | undefined = 0;
  @Input() readonly = true;
  @Input() fontSize = 0.7;
  @Input() maxRating = 5;
  @Input() showCount = false;
  @Input() totalReviews = 0;
  // eslint-disable-next-line keyword-spacing
  @Input() set editable(value: boolean) {
    if (value) {
      this.readonly = false;
    }
  }
  @Output() ratingChanged = new EventEmitter<number>();

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

  setRating(value: number) {
    if (!this.readonly) {
      this.rating = value;
      this.ratingChanged.emit(value);
    }
  }
}
