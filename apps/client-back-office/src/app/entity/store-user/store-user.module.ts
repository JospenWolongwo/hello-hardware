import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { _MatSlideToggleRequiredValidatorModule, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { EditPermissionsComponent } from './edit-permissions/edit-permissions.component';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { ViewStoreUserComponent } from './view-store-user/view-store-user.component';
import { StoreUserComponent } from './store-user.component';

@NgModule({
  declarations: [StoreUserComponent, InviteUserComponent, EditPermissionsComponent, ViewStoreUserComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [StoreUserComponent],
})
export class StoreUserModule {}
