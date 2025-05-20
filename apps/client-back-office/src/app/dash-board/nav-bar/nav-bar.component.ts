import { Component, EventEmitter, Input, Output } from '@angular/core';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { MatDialog } from '@angular/material/dialog';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, public dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon(
      `profile_picture`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/profile_picture.svg')
    );
  }

  public sideBarToggled = false;

  @Input()
  currentEntityName = '';

  @Input()
  userName: string | null = null;

  @Output()
  toggled = new EventEmitter<boolean>();

  @Output()
  loggedOut = new EventEmitter<boolean>();

  logout() {
    this.loggedOut.emit(true);
  }

  openSearchDialog() {
    this.dialog.open(SearchDialogComponent, {
      data: {
        entity: this.currentEntityName,
      },
      position: { top: '20%' },
      minHeight: '120px',
    });
  }

  public toggle() {
    this.sideBarToggled = !this.sideBarToggled;
    this.toggled.emit(this.sideBarToggled);
  }
}
