import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app.routing';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'; // date and time
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { DatePipe } from '@angular/common';
import { MapToIterablePipe } from './shared/pipes/map-to-iterable.pipe';


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
import { HotAdvsListComponent } from './components/hot-advs/hot-advs-list/hot-advs-list.component';
import { HotAdvsAddComponent } from './components/hot-advs/hot-advs-add/hot-advs-add.component';

import { AdvertisementService } from './shared/services/advertisement.service';
import { PromotionTypeService } from './shared/services/promotion-type.service';
import { DenominationService } from './shared/services/denomination.service';
import { FeedbackService } from './shared/services/feedback.service';
import { CategoryService } from './shared/services/category.service';
import { BannerService } from './shared/services/banner.service';
import { AuthGuard } from './shared/guards/index';

import { StatisticsFeedbackComponent } from './components/feedback/statistics-feedback/statistics-feedback.component';

import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { LinkCardListComponent } from './components/link-card/link-card-list/link-card-list.component';
import { FeeListComponent } from './components/fee/fee-list/fee-list.component';
import { FeeService } from './shared/services/fee.service';
import { FeeAddComponent } from './components/fee/fee-add/fee-add.component';

import { BannerListComponent } from './components/banner/banner-list/banner-list.component';
import { BannerDetailComponent } from './components/banner/banner-detail/banner-detail.component';
import { BannerAddComponent } from './components/banner/banner-add/banner-add.component';

import { ListEventComponent } from './components/events/list-event/list-event.component';
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { ListFaqComponent } from './components/faqs/list-faq/list-faq.component';
import { AddFaqComponent } from './components/faqs/add-faq/add-faq.component';
import { EditFaqComponent } from './components/faqs/edit-faq/edit-faq.component';
import { ListGameComponent } from './components/games/list-game/list-game.component';
import { AddGameComponent } from './components/games/add-game/add-game.component';
import { EditGameComponent } from './components/games/edit-game/edit-game.component';
import { ListHotComponent } from './components/hots/list-hot/list-hot.component';
import { AddHotComponent } from './components/hots/add-hot/add-hot.component';
import { EditHotComponent } from './components/hots/edit-hot/edit-hot.component';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { AddPostComponent } from './components/posts/add-post/add-post.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { ListPromotionLabelComponent } from './components/promotion-labels/list-promotion-label/list-promotion-label.component';
import { AddPromotionLabelComponent } from './components/promotion-labels/add-promotion-label/add-promotion-label.component';
import { EditPromotionLabelComponent } from './components/promotion-labels/edit-promotion-label/edit-promotion-label.component';
import { FormEventComponent } from './components/events/form-event/form-event.component';
import { FormGameComponent } from './components/games/form-game/form-game.component';
import { FormPostComponent } from './components/posts/form-post/form-post.component';

import { HomeComponent } from './components/home/home.component';

import { AddPromotionComponent } from './components/promotions/add-promotion/add-promotion.component';
import { EditPromotionComponent } from './components/promotions/edit-promotion/edit-promotion.component';
import { PromotionFormComponent } from './components/promotions/promotion-form/promotion-form.component';
import { ListPromotionComponent } from './components/promotions/list-promotion/list-promotion.component';
import { UserPromotionComponent } from './components/promotions/user-promotion/user-promotion.component';
import { FormHotComponent } from './components/hots/form-hot/form-hot.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';




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
    StatisticsFeedbackComponent,
    HotAdvsListComponent,
    HotAdvsAddComponent,
    UserListComponent,
    UserAddComponent,
    UserDetailComponent,
    LinkCardListComponent,
    FeeListComponent,
    FeeAddComponent,
    BannerListComponent,
    BannerDetailComponent,
    BannerAddComponent,
    ListEventComponent,
    AddEventComponent,
    EditEventComponent,
    ListFaqComponent,
    AddFaqComponent,
    EditFaqComponent,
    ListGameComponent,
    AddGameComponent,
    EditGameComponent,
    ListHotComponent,
    AddHotComponent,
    EditHotComponent,
    ListPostComponent,
    AddPostComponent,
    EditPostComponent,
    ListPromotionLabelComponent,
    AddPromotionLabelComponent,
    EditPromotionLabelComponent,
    FormEventComponent,
    FormGameComponent,
    FormPostComponent,
    HomeComponent,
    AddPromotionComponent,
    EditPromotionComponent,
    PromotionFormComponent,
    ListPromotionComponent,
    UserPromotionComponent,
    FormHotComponent,
    ErrorComponent,
    LoginComponent,
    MapToIterablePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    CKEditorModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    RecaptchaModule.forRoot(), // Keep in mind the "forRoot"-magic nuances!
    RecaptchaFormsModule,
  ],
  providers: [
    AdvertisementService,
    PromotionTypeService,
    DenominationService,
    FeedbackService,
    FeeService,
    BannerService,
    CategoryService,
    AuthGuard,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
