import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashBoardModule } from './dash-board/dash-board.module';
import { ProductModule } from './entity/product/product.module';
import { ProductCategoryModule } from './entity/product-category/product-category.module';
import { StockModule } from './entity/stock/stock.module';
import { StoreModule } from './entity/store/store.module';
import { StoreUserModule } from './entity/store-user/store-user.module';
import { AuthInterceptor } from './shared/services/auth-interceptor.service';
import { ErrorInterceptor } from './shared/services/error-interceptor.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DashBoardModule,
    ProductCategoryModule,
    StoreModule,
    StoreUserModule,
    ProductModule,
    StockModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
