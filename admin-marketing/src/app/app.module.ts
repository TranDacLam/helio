import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { UsersComponent } from './components/users/users.component';
import { UserMultiselectComponent } from './components/user-multiselect/user-multiselect.component';
import { PromotionUsersComponent } from './components/promotions/promotion-users/promotion-users.component';
import { PromotionsComponent } from './components/promotions/promotions/promotions.component';
import { PromotionDetailComponent } from './components/promotions/promotion-detail/promotion-detail.component';
import { PromotionLabelListComponent } from './components/promotion-label/promotion-label-list/promotion-label-list.component';
import { PromotionLabelAddComponent } from './components/promotion-label/promotion-label-add/promotion-label-add.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';

import { PromotionService } from './shared/services/promotion.service';
import { PromotionLabelService } from './shared/services/promotion-label.service';
import { AdvertisementService } from './shared/services/advertisement.service';
import { AdvertisementAddComponent } from './components/advertisement/advertisement-add/advertisement-add.component';
import { AdvertisementDetailComponent } from './components/advertisement/advertisement-detail/advertisement-detail.component';



@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserMultiselectComponent,
    PromotionUsersComponent,
    PromotionsComponent,
    PromotionDetailComponent,
    PromotionLabelListComponent,
    PromotionLabelAddComponent,
    AdvertisementListComponent,
    AdvertisementAddComponent,
    AdvertisementDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    CKEditorModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [
    PromotionService,
    PromotionLabelService,
    AdvertisementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
