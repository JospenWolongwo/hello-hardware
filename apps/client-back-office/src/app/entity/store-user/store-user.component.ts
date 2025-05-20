/* eslint-disable max-lines */
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopUpConfirmationComponent } from '../../shared/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpMessageComponent } from '../../shared/pop-up-message/pop-up-message.component';
import {
  confirmationModalConfig,
  dialogFormConfig,
  successModalConfig,
  viewModalConfig,
} from '../../shared/utils/constants';
import { EntityComponent } from '../entity.component';
import { Store } from '../store/store';
import { StoreService } from '../store/store.service';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { InviteUserDto } from './invite-user/invite-user-dto.interface';
import { ViewStoreUserComponent } from './view-store-user/view-store-user.component';
import { StoreUser } from './store-user';
import { StoreUserService } from './store-user.service';
import { StoreUserPaginatorIntl } from './store-user-paginator-intl.service';

@Component({
  selector: 'app-store-user',
  templateUrl: './store-user.component.html',
  providers: [StoreUserService, StoreService, { provide: MatPaginatorIntl, useClass: StoreUserPaginatorIntl }],
})
export class StoreUserComponent extends EntityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private storeUserService: StoreUserService,
    private storeService: StoreService,
    public dialog: MatDialog
  ) {
    super();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  stores: string[] = [];

  storeUsers: StoreUser[] = [];

  selectedStore = '';

  permissions = {
    addPermissions: false,
    revokePermissions: false,
    viewStoreUser: false,
    editStoreUser: false,
    activateStoreUser: false,
    deactivateStoreUser: false,
    inviteUserToStore: false,
  };

  selection = new SelectionModel<StoreUser>(true, []);

  get editPermissions() {
    return this.permissions.revokePermissions || this.permissions.addPermissions;
  }

  get isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  changeStore(store: string) {
    this.selection.clear();

    this.selectedStore = store;

    this.data = this.storeUsers.filter((storeUser) => storeUser.store === this.selectedStore);

    this.dataSource.data = this.data;
  }

  isSelected(storeUser: StoreUser) {
    return this.selection.isSelected(storeUser);
  }

  toggleRow(event: Event, storeUser: StoreUser) {
    event.stopPropagation();
    this.selection.toggle(storeUser);
  }

  toggleAllRows() {
    if (this.isAllSelected) {
      this.selection.clear();

      return;
    }

    this.selection.select(...(<StoreUser[]>this.dataSource.data));
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

  editStoreUsersStatus(users: string[], enabled: boolean) {
    users.forEach((user) => {
      const userIndex = (<StoreUser[]>this.data).findIndex((storeUser) => storeUser.userId === user);

      (<StoreUser>this.data[userIndex]).enabled = enabled;
    });

    this.dataSource.data = this.data;
  }

  activateUsers(users: string[]) {
    return this.storeUserService.activateStoreUsers(users, this.selectedStore).subscribe((response) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: response.message,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editStoreUsersStatus(users, true);
        })
      );
    });
  }

  inviteUser(invitationDto: InviteUserDto) {
    return this.storeService.inviteUserToStore(invitationDto).subscribe((response) => {
      this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: response.message,
          class: 'success',
        },
        ...successModalConfig,
      });
    });
  }

  deactivateUsers(users: string[]) {
    return this.storeUserService.deactivateStoreUsers(users, this.selectedStore).subscribe((response) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: response.message,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editStoreUsersStatus(users, false);
        })
      );
    });
  }

  activateUserDialog() {
    const confirmActivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Activation of user message@@activateUserConfirmationMessage:Are you sure you want to activate the selected user(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmActivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const users = this.selection.selected.map((storeUser) => storeUser.userId);

          this.subscriptions.push(this.activateUsers(users));
        }
      })
    );
  }

  deactivateUserDialog() {
    const confirmDeactivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Deactivation of user message@@deactivateUserConfirmationMessage:Are you sure you want to deactivate the selected user(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmDeactivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const users = this.selection.selected.map((storeUser) => storeUser.userId);

          this.subscriptions.push(this.deactivateUsers(users));
        }
      })
    );
  }

  invitationDialog() {
    const inviteUserDialogRef = this.dialog.open(InviteUserComponent, {
      data: {
        title: $localize`:Modal Title|Send invitation modal title@@sendInvitationModalTitle:Send an Invitation`,
        action: $localize`:Modal Action|Send invitation modal action@@sendAction:Send`,
        stores: this.stores,
      },
      ...dialogFormConfig,
      minHeight: '350px',
    });
    this.subscriptions.push(
      inviteUserDialogRef.afterClosed().subscribe((result: InviteUserDto) => {
        if (result?.store && result?.email) {
          this.subscriptions.push(this.inviteUser(result));
        }
      })
    );
  }

  viewStoreUserDialog(storeUserId: string) {
    const storeData = <StoreUser>this.data.find((store) => store.id === storeUserId);

    this.dialog.open(ViewStoreUserComponent, {
      data: {
        ...storeData,
      },
      ...viewModalConfig,
      ariaLabel: $localize`:View store Modal@@viewStoreUserModal:View store user modal`,
    });
  }

  ngOnInit(): void {
    this.displayedColumns = ['select', 'first-name', 'last-name', 'email', 'gender', 'enabled', 'actions'];

    this.subscriptions.push(
      this.route.data.subscribe(({ storeUsers, stores, userPermissions }) => {
        const permissions = <string[]>userPermissions;

        this.permissions.addPermissions = permissions.includes('AddPermissions');

        this.permissions.revokePermissions = permissions.includes('RevokePermissions');

        this.permissions.activateStoreUser = permissions.includes('ActivateStoreUser');

        this.permissions.deactivateStoreUser = permissions.includes('DeactivateStoreUser');

        this.permissions.viewStoreUser = permissions.includes('ViewStore');

        this.permissions.editStoreUser = permissions.includes('EditStore');

        this.permissions.inviteUserToStore = permissions.includes('InviteUserToStore');

        this.storeUsers = storeUsers;

        this.stores = (<Store[]>stores).map((store) => store.name);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
