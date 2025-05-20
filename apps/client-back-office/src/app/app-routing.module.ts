import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { ProductComponent } from './entity/product/product.component';
import { productResolver, productsResolver } from './entity/product/products.resolver';
import { ProductCategoryComponent } from './entity/product-category/product-category.component';
import { productCategoryResolver } from './entity/product-category/product-category.resolver';
import { StockComponent } from './entity/stock/stock.component';
import { stockResolver } from './entity/stock/stock.resolver';
import { StoreComponent } from './entity/store/store.component';
import { storeResolver } from './entity/store/store.resolver';
import { EditPermissionsComponent } from './entity/store-user/edit-permissions/edit-permissions.component';
import { storeUserResolver } from './entity/store-user/edit-permissions/store-user.resolver';
import { StoreUserComponent } from './entity/store-user/store-user.component';
import { storeUsersResolver } from './entity/store-user/store-users.resolver';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { authChildrenGuard, authGuard } from './shared/guards/auth.guard';
import { permissionGuard } from './shared/guards/permissions.guard';
import { storeUserPermissionsGuard } from './shared/guards/store-user-permissions.guard';
import { permissionResolver } from './shared/resolvers/permission.resolver';
import { UserResolver } from './shared/resolvers/user.resolver';
import { pagePermissions } from './shared/utils/permission';

const routes: Routes = [
  {
    path: '',
    component: DashBoardComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildrenGuard],
    resolve: { user: UserResolver },
    children: [
      {
        path: 'product-categories',
        component: ProductCategoryComponent,
        resolve: { productCategories: productCategoryResolver },
      },
      {
        path: 'products',
        component: ProductComponent,
        data: {
          permissions: [pagePermissions.STORE],
        },
        canActivate: [permissionGuard],
        resolve: {
          stores: storeResolver,
          userPermissions: permissionResolver,
          products: productsResolver,
        },
      },
      {
        path: 'products/:id/stocks',
        component: StockComponent,
        data: {
          permissions: [pagePermissions.STOCK],
        },
        canActivate: [permissionGuard],
        resolve: {
          stocks: stockResolver,
          product: productResolver,
          userPermissions: permissionResolver,
        },
      },
      {
        path: 'stores',
        component: StoreComponent,
        data: {
          permissions: [pagePermissions.STORE],
        },
        canActivate: [permissionGuard],
        resolve: { stores: storeResolver, userPermissions: permissionResolver },
      },
      {
        path: 'store-users',
        component: StoreUserComponent,
        data: {
          permissions: [pagePermissions.STORE_USER],
        },
        canActivate: [permissionGuard],
        resolve: { stores: storeResolver, storeUsers: storeUsersResolver, userPermissions: permissionResolver },
      },
      {
        path: 'store-users/:id/permissions',
        component: EditPermissionsComponent,
        resolve: { storeUser: storeUserResolver, userPermissions: permissionResolver },
        canActivate: [storeUserPermissionsGuard],
      },
      {
        path: 'orders',
        component: WelcomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
