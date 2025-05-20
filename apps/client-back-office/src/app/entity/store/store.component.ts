/* eslint-disable max-lines */
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { ActivatedRoute } from '@angular/router';
import type { Subscription } from 'rxjs';
import { PopUpMessageComponent } from '../../../app/shared/pop-up-message/pop-up-message.component';
import { PopUpConfirmationComponent } from '../../shared/pop-up-confirmation/pop-up-confirmation.component';
import {
  confirmationModalConfig,
  dialogFormConfig,
  successModalConfig,
  viewModalConfig,
} from '../../shared/utils/constants';
import { EntityComponent } from '../entity.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { CreateStoreDto } from './create-store/create-store-dto.interface';
import { ViewStoreComponent } from './view-store/view-store.component';
import { Store } from './store';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { StoreService } from './store.service';
import { StorePaginatorIntl } from './store-paginator-intl.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  providers: [StoreService, { provide: MatPaginatorIntl, useClass: StorePaginatorIntl }],
})
export class StoreComponent extends EntityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private route: ActivatedRoute, private storeService: StoreService, public dialog: MatDialog) {
    super();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  permissions = {
    createBranch: false,
    viewStore: false,
    editStore: false,
    deleteStore: false,
  };

  updateDataListElement(editedStore: Store) {
    const storeIndex = this.data.findIndex((store) => store.id === editedStore.id);
    this.data = this.data.map((store) => {
      const index = (<Store>store).branches.findIndex((branch) => branch === (<Store>this.data[storeIndex]).name);

      if (index !== -1) {
        (<Store>store).branches[index] = editedStore.name;
      }

      if ((<Store>store).parent === (<Store>this.data[storeIndex]).name) {
        (<Store>store).parent = editedStore.name;
      }

      return store;
    });

    editedStore.parent = (<Store>this.data[storeIndex]).parent;
    editedStore.branches = (<Store>this.data[storeIndex]).branches;

    this.data[storeIndex] = editedStore;

    this.dataSource.data = this.data;
  }

  createStore(createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto).subscribe((newStore) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful creation of store message@@createdStoreMessage:The ${
            newStore.name[0].toLocaleUpperCase() + newStore.name.slice(1)
          } store was successfully added.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data.push(newStore);

          this.dataSource.data = this.data;
        })
      );
    });
  }

  createBranch(createBranchDto: CreateStoreDto, parent: Store) {
    return this.storeService.createStore(createBranchDto, parent.id).subscribe((newStore) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful creation of branch message@@createdBranchMessage:The ${newStore.name} branch was successfully added to the ${parent.name} store.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data.push(newStore);

          this.dataSource.data = this.data;
        })
      );
    });
  }

  editStore(editStoreDto: CreateStoreDto, storeId: string) {
    return this.storeService.editStore(editStoreDto, storeId).subscribe((editedStore) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful update of a store message@@editStoreMessage:The store was successfully edited.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.updateDataListElement(editedStore);
        })
      );
    });
  }

  createStoreDialog() {
    const createProductCategoryDialogRef = this.dialog.open(CreateStoreComponent, {
      data: {
        title: $localize`:Modal Title|Create store modal title@@createStoreModalTitle:New Store`,
        action: $localize`:Modal Action|Create store modal action@@createAction:Create`,
      },
      ...dialogFormConfig,
      ariaLabel: $localize`:Store creation modal@@storeCreationModal:Store creation Modal`,
    });
    this.subscriptions.push(
      createProductCategoryDialogRef.afterClosed().subscribe((result: CreateStoreDto) => {
        if (result?.name) {
          this.subscriptions.push(this.createStore(result));
        }
      })
    );
  }

  createBranchDialog(parentId: string) {
    const parentData = <Store>this.data.find((store) => store.id === parentId);

    const parentName = parentData.parent ? `${parentData.name} (${parentData.parent})` : `${parentData.name}`;

    const createProductSubCategoryDialogRef = this.dialog.open(CreateStoreComponent, {
      data: {
        title: $localize`:Modal Title|Create branch modal title@@createBranchModalTitle:New branch of ${parentName}`,
        action: $localize`:Modal Action|Create store modal action@@createAction:Create`,
      },
      maxWidth: '500px',
      ...dialogFormConfig,
      ariaLabel: $localize`:Branch creation modal@@branchCreationModal:Store's Branch creation Modal`,
    });

    this.subscriptions.push(
      createProductSubCategoryDialogRef.afterClosed().subscribe((result: CreateStoreDto) => {
        if (result?.name) {
          this.subscriptions.push(this.createBranch(result, parentData));
        }
      })
    );
  }

  editStoreDialog(storeId: string) {
    const storeData = <Store>this.data.find((store) => store.id === storeId);

    const storeName = storeData.parent ? `${storeData.name} (${storeData.parent})` : `${storeData.name}`;

    const editStoreDialogRef = this.dialog.open(CreateStoreComponent, {
      data: {
        title: $localize`:Modal Title|Edit store modal title@@editStoreModalTitle:Edit ${storeName} store`,
        categoryInfo: { name: storeData.name, description: storeData.description },
        action: $localize`:Modal Action|Edit store modal action@@editModalAction:Edit`,
      },
      ...dialogFormConfig,
      maxWidth: '500px',
      ariaLabel: $localize`:Edit a store modal@@editStoreModal:Edit store modal`,
    });

    this.subscriptions.push(
      editStoreDialogRef.beforeClosed().subscribe((result: CreateStoreDto) => {
        if (result?.name) {
          const confirmationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
            data: {
              message: $localize`:Confirmation Modal Message|Edit store confirmation message@@editStoreConfirmationMessage:Are you sure you want to edit the ${storeName} store?`,
            },
            ...confirmationModalConfig,
          });

          this.subscriptions.push(
            confirmationDialogRef.afterClosed().subscribe((response: boolean) => {
              if (response) {
                this.subscriptions.push(this.editStore(result, storeId));
              }
            })
          );
        }
      })
    );
  }

  viewStoreDialog(storeId: string) {
    const storeData = <Store>this.data.find((store) => store.id === storeId);

    this.dialog.open(ViewStoreComponent, {
      data: {
        ...storeData,
      },
      ...viewModalConfig,
      ariaLabel: $localize`:View store Modal@@viewStoreModal:View store modal`,
    });
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'row-number',
      'name',
      'description',
      'parent',
      'branches',
      'created-at',
      'updated-at',
      'actions',
    ];

    this.subscriptions.push(
      this.route.data.subscribe(({ stores, userPermissions }) => {
        const permissions = <string[]>userPermissions;

        this.permissions.createBranch = permissions.includes('CreateBranch');

        this.permissions.viewStore = permissions.includes('ViewStore');

        this.permissions.editStore = permissions.includes('EditStore');

        this.data = stores;

        this.dataSource.data = this.data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
