import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DashBoardComponent } from './dash-board.component';

@NgModule({
  declarations: [NavBarComponent, SearchInputComponent, SideBarComponent, SearchDialogComponent, DashBoardComponent],
  imports: [
    FlexLayoutModule,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [DashBoardComponent, FlexLayoutModule],
})
export class DashBoardModule {}
