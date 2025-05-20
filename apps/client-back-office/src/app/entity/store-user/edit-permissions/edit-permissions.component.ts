/* eslint-disable max-lines */
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopUpConfirmationComponent } from '../../../shared/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpMessageComponent } from '../../../shared/pop-up-message/pop-up-message.component';
import { confirmationModalConfig, PERMISSIONS, successModalConfig } from '../../../shared/utils/constants';
import { StoreUser } from '../store-user';
import { StoreUserService } from '../store-user.service';
import { StoreUserPermissionsPaginatorIntl } from './store-user-permissions-paginator-intl.service';

@Component({
  selector: 'app-edit-permissions',
  templateUrl: './edit-permissions.component.html',
  styleUrls: ['./edit-permissions.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: StoreUserPermissionsPaginatorIntl }],
})
export class EditPermissionsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['select', 'row-number', 'permission', 'status'];

  permissions: { name: string; status: boolean }[] = [];

  dataSource = new MatTableDataSource(this.permissions);

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private storeUserService: StoreUserService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  canRevokePermissions = false;

  canAddPermissions = false;

  user: StoreUser | null = null;

  selection = new SelectionModel<{ name: string; status: boolean }>(true, []);

  get isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  isSelected(permission: { name: string; status: boolean }) {
    return this.selection.isSelected(permission);
  }

  toggleRow(event: Event, permission: { name: string; status: boolean }) {
    event.stopPropagation();
    this.selection.toggle(permission);
  }

  toggleAllRows() {
    if (this.isAllSelected) {
      this.selection.clear();

      return;
    }

    this.selection.select(...(<{ name: string; status: boolean }[]>this.dataSource.data));
  }

  get userName() {
    if (this.user !== null) {
      const name =
        this.user?.firstName && this.user?.lastName ? `${this.user.firstName} ${this.user.lastName}` : this.user.email;

      return name;
    }

    return '';
  }

  get selectionIsNotEmpty() {
    return this.selection.hasValue();
  }

  get allIsSelected() {
    return this.selectionIsNotEmpty && this.isAllSelected;
  }

  get undetermined() {
    return this.selectionIsNotEmpty && !this.isAllSelected;
  }

  editPermissionStatus(permissions: string[], enabled: boolean) {
    permissions.forEach((permissionName) => {
      const permissionIndex = this.permissions.findIndex((permission) => permission.name === permissionName);

      this.permissions[permissionIndex].status = enabled;
    });

    this.dataSource.data = this.permissions;
  }

  addPermissions(userId: string, permissions: string[]) {
    return this.storeUserService.activateStoreUserPermissions(userId, permissions).subscribe(() => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Title|Successful permissions activation @@successPermissionActivation:Permissions successfully activated.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editPermissionStatus(permissions, true);
        })
      );
    });
  }

  revokePermissions(userId: string, permissions: string[]) {
    return this.storeUserService.deactivateStoreUserPermissions(userId, permissions).subscribe(() => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Title|Successful permissions deactivation @@successPermissionDeactivation:Permissions successfully deactivated.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editPermissionStatus(permissions, false);
        })
      );
    });
  }

  activatePermissionDialog() {
    const confirmActivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Activation of permissions message@@activatePermissionsConfirmationMessage:Are you sure you want to activate the selected permission(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmActivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const selectedPermissions = this.selection.selected.map((permission) => permission.name);

          const permissionsToActivate = selectedPermissions.filter(
            (permission) => !(<StoreUser>this.user).permissions.includes(permission)
          );

          if (permissionsToActivate.length > 0) {
            this.subscriptions.push(this.addPermissions((<StoreUser>this.user).userId, permissionsToActivate));
          } else {
            this.dialog.open(PopUpMessageComponent, {
              data: {
                title: $localize`:Permissions selected are already active@@activationErrorTitle:Permissions already active`,
                message: $localize`:Permissions selected are already active@@activationErrorMessage:The permissions selected were already activated.`,
                class: 'error',
              },
              minWidth: '300px',
              ariaLabel: $localize`:An Error occurred@@errorPermissionModal:can not active activated permissions.`,
            });
          }
        }
      })
    );
  }

  deactivatePermissionDialog() {
    const confirmActivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Deactivation of permissions message@@deactivatePermissionsConfirmationMessage:Are you sure you want to deactivate the selected permission(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmActivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const selectedPermissions = this.selection.selected.map((permission) => permission.name);

          const permissionsToDeactivate = selectedPermissions.filter((permission) =>
            (<StoreUser>this.user).permissions.includes(permission)
          );

          if (permissionsToDeactivate.length > 0) {
            this.subscriptions.push(this.revokePermissions((<StoreUser>this.user).userId, permissionsToDeactivate));
          } else {
            this.dialog.open(PopUpMessageComponent, {
              data: {
                title: $localize`:Permissions selected are already nonactive@@deactivationErrorTitle:Permissions already deactivated`,
                message: $localize`:Permissions selected are already nonactive@@deactivationErrorMessage:The permissions selected were already deactivated.`,
                class: 'error',
              },
              minWidth: '300px',
              ariaLabel: $localize`:An Error occurred@@deactivationErrorModal:can not deactive activated permissions.`,
            });
          }
        }
      })
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(({ storeUser, userPermissions }) => {
        this.user = <StoreUser>storeUser;

        this.canAddPermissions = (<string[]>userPermissions).includes('AddPermissions');

        this.canRevokePermissions = (<string[]>userPermissions).includes('RevokePermissions');

        const allPermissions = [
          ...PERMISSIONS.DELIVERY,
          ...PERMISSIONS['ORDER-ITEM'],
          ...PERMISSIONS.PRODUCT,
          ...PERMISSIONS.STOCK,
          ...PERMISSIONS.STORE,
          ...PERMISSIONS['STORE-USER'],
        ];
        allPermissions.forEach((permission) => {
          const status = this.user?.permissions.includes(permission) ?? false;
          this.permissions.push({
            name: permission,
            status: status,
          });
        });

        this.dataSource.data = this.permissions;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
