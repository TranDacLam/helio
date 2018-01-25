import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { UsersComponent } from './components/users/users.component';
import { UserMultiselectComponent } from './components/user-multiselect/user-multiselect.component';
import { PromotionUsersComponent } from './components/promotions/promotion-users/promotion-users.component';
import { PromotionsComponent } from './components/promotions/promotions/promotions.component';

import { PromotionService } from './shared/services/promotion.service';
import { PromotionDetailComponent } from './components/promotions/promotion-detail/promotion-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserMultiselectComponent,
    PromotionUsersComponent,
    PromotionsComponent,
    PromotionDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CKEditorModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [
    PromotionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
