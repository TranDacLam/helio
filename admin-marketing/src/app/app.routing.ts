import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { LinkCardListComponent } from './components/link-card/link-card-list/link-card-list.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';
import { UsersPromotionComponent } from './components/promotions/users-promotion/users-promotion.component';
import { PromotionsComponent } from './components/promotions/promotions/promotions.component';
import { PromotionDetailComponent } from './components/promotions/promotion-detail/promotion-detail.component';
import { PromotionLabelListComponent } from './components/promotion-label/promotion-label-list/promotion-label-list.component';
import { PromotionLabelAddComponent } from './components/promotion-label/promotion-label-add/promotion-label-add.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementDetailComponent } from './components/advertisement/advertisement-detail/advertisement-detail.component';
import { AdvertisementAddComponent } from './components/advertisement/advertisement-add/advertisement-add.component';
import { PromotionTypeListComponent } from './components/promotion-type/promotion-type-list/promotion-type-list.component';
import { DenominationAddComponent } from './components/denomination/denomination-add/denomination-add.component';
import { DenominationListComponent } from './components/denomination/denomination-list/denomination-list.component';
import { FeedbackDetailComponent } from './components/feedback/feedback-detail/feedback-detail.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { HotAdvsAddComponent } from './components/hot-advs/hot-advs-add/hot-advs-add.component';
import { HotAdvsListComponent } from './components/hot-advs/hot-advs-list/hot-advs-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { FeeListComponent } from './components/fee/fee-list/fee-list.component';
import { FeeAddComponent } from './components/fee/fee-add/fee-add.component';
import { BannerAddComponent } from './components/banner/banner-add/banner-add.component';
import { BannerListComponent } from './components/banner/banner-list/banner-list.component';
import { BannerDetailComponent } from './components/banner/banner-detail/banner-detail.component';
 
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
    { 
        path: '', component: HomeComponent
    }, { 
        path: 'users', component: UsersComponent
    }, { 
     	path: 'promotions', component: PromotionsComponent
    }, { 
     	path: 'users-promotions/:id', component: UsersPromotionComponent
    }, { 
     	path: 'promotions/:id', component: PromotionDetailComponent
    }, {
        path: 'promotion-label-list', component: PromotionLabelListComponent
    }, {
        path: 'promotion-label-add', component: PromotionLabelAddComponent
    }, {
        path: 'advertisement-list', component: AdvertisementListComponent
    }, {
        path: 'advertisement-detail/:id', component: AdvertisementDetailComponent
    }, {
        path: 'advertisement-add', component: AdvertisementAddComponent
    },{
        path: 'promotion-type-list', component: PromotionTypeListComponent
    },{
        path: 'denomination-add', component: DenominationAddComponent
    }, {
        path: 'denomination-list', component: DenominationListComponent
    }, {
        path: 'feedback-list', component: FeedbackListComponent
    }, {
        path: 'feedback-detail/:id', component: FeedbackDetailComponent
    }, {
        path: 'hot-advs-add', component: HotAdvsAddComponent
    }, {
        path: 'hot-advs-list', component: HotAdvsListComponent
    }, {
        path: 'user-add', component: UserAddComponent
    }, {
        path: 'user-list', component: UserListComponent
    }, {
        path: 'user-detail', component: UserDetailComponent
    }, {
        path: 'link-card-list', component: LinkCardListComponent
    },{
        path: 'banner-add', component: BannerAddComponent
    }, {
        path: 'banner-list', component: BannerListComponent
    }, {
        path: 'banner-detail', component: BannerDetailComponent
    },
    { path: 'link-card/add', component: AddLinkCardComponent },
    { path: 'link-card/detail/:id', component: LinkCardDetailComponent },
    { path: 'notifications', component: ListNotificationComponent },
    { path: 'notification/add', component: AddNotificationComponent },
    { path: 'notification/edit/:id', component: EditNotificationComponent },
    { path: 'notification/detail/:id', component: NotificationDetailComponent },
    { path: 'fees', component: FeeListComponent },
    { path: 'fee-add', component: FeeAddComponent },


];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
