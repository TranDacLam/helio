import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';
import { PromotionUsersComponent } from './components/promotions/promotion-users/promotion-users.component';
import { PromotionsComponent } from './components/promotions/promotions/promotions.component';
import { PromotionDetailComponent } from './components/promotions/promotion-detail/promotion-detail.component';
import { PromotionLabelListComponent } from './components/promotion-label/promotion-label-list/promotion-label-list.component';
import { PromotionLabelAddComponent } from './components/promotion-label/promotion-label-add/promotion-label-add.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementDetailComponent } from './components/advertisement/advertisement-detail/advertisement-detail.component';
import { AdvertisementAddComponent } from './components/advertisement/advertisement-add/advertisement-add.component';

const routes: Routes = [
    { 
        path: 'users', component: UsersComponent
    }, { 
     	path: 'promotions', component: PromotionsComponent
    }, { 
     	path: 'promotion-users-detail/:id', component: PromotionUsersComponent
    }, { 
     	path: 'promotion-detail/:id', component: PromotionDetailComponent
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
    },
    { path: 'link-card/add', component: AddLinkCardComponent },
    { path: 'link-card/detail/:id', component: LinkCardDetailComponent },
    { path: 'notifications', component: ListNotificationComponent },
    { path: 'notification/add', component: AddNotificationComponent },
    { path: 'notification/edit/:id', component: EditNotificationComponent },
    { path: 'notification/detail/:id', component: NotificationDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
