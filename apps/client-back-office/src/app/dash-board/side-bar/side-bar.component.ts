import { Component, Input } from '@angular/core';
import type { SideBarLink } from '../../shared/interfaces/side-bar-link';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  @Input()
  public links: SideBarLink[] = [];
}
