import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { FormUserAppComponent } from './components/link-card/form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from './components/link-card/form-user-embed/form-user-embed.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';
import { UserMultiselectComponent } from './components/user-multiselect/user-multiselect.component';
import { PromotionUsersComponent } from './components/promotions/promotion-users/promotion-users.component';
import { PromotionsComponent } from './components/promotions/promotions/promotions.component';
import { PromotionDetailComponent } from './components/promotions/promotion-detail/promotion-detail.component';
import { PromotionLabelListComponent } from './components/promotion-label/promotion-label-list/promotion-label-list.component';
import { PromotionLabelAddComponent } from './components/promotion-label/promotion-label-add/promotion-label-add.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementAddComponent } from './components/advertisement/advertisement-add/advertisement-add.component';
import { AdvertisementDetailComponent } from './components/advertisement/advertisement-detail/advertisement-detail.component';
import { PromotionTypeListComponent } from './components/promotion-type/promotion-type-list/promotion-type-list.component';
import { DenominationListComponent } from './components/denomination/denomination-list/denomination-list.component';
import { DenominationAddComponent } from './components/denomination/denomination-add/denomination-add.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackDetailComponent } from './components/feedback/feedback-detail/feedback-detail.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';
import { FormNotificationComponent } from './components/notification/form-notification/form-notification.component';
import { PopupEditNotificationComponent } from './components/notification/popup-edit-notification/popup-edit-notification.component';
import { ShowErrorValidComponent } from './components/show-error-valid/show-error-valid.component';

import { PromotionService } from './shared/services/promotion.service';
import { PromotionLabelService } from './shared/services/promotion-label.service';
import { AdvertisementService } from './shared/services/advertisement.service';
import { PromotionTypeService } from './shared/services/promotion-type.service';
import { DenominationService } from './shared/services/denomination.service';
import { FeedbackService } from './shared/services/feedback.service';




@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    AddLinkCardComponent,
    FormUserAppComponent,
    FormUserEmbedComponent,
    LinkCardDetailComponent,
    ListNotificationComponent,
    AddNotificationComponent,
    EditNotificationComponent,
    UserMultiselectComponent,
    PromotionUsersComponent,
    PromotionsComponent,
    PromotionDetailComponent,
    PromotionLabelListComponent,
    PromotionLabelAddComponent,
    AdvertisementListComponent,
    AdvertisementAddComponent,
    AdvertisementDetailComponent,
    PromotionTypeListComponent,
    DenominationListComponent,
    DenominationAddComponent,
    FeedbackListComponent,
    FeedbackDetailComponent,
    NotificationDetailComponent,
    FormNotificationComponent,
    PopupEditNotificationComponent,
    ShowErrorValidComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    CKEditorModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule
  ],
  providers: [
    PromotionService,
    PromotionLabelService,
    AdvertisementService,
    PromotionTypeService,
    DenominationService,
    FeedbackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
