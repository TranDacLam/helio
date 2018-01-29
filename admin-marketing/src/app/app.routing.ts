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

const routes: Routes = [
    { 
        path: 'users', component: UsersComponent
    }, { 
     	path: 'promotions', component: PromotionsComponent
    }, { 
     	path: 'promotion-users-detail/:id', component: PromotionUsersComponent
    }, { 
     	path: 'promotion-detail/:id', component: PromotionDetailComponent
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
