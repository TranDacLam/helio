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
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementDetailComponent } from './components/advertisement/advertisement-detail/advertisement-detail.component';
import { AdvertisementAddComponent } from './components/advertisement/advertisement-add/advertisement-add.component';
import { PromotionTypeListComponent } from './components/promotion-type/promotion-type-list/promotion-type-list.component';
import { DenominationAddComponent } from './components/denomination/denomination-add/denomination-add.component';
import { DenominationListComponent } from './components/denomination/denomination-list/denomination-list.component';
import { FeedbackDetailComponent } from './components/feedback/feedback-detail/feedback-detail.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { StatisticsFeedbackComponent } from './components/feedback/statistics-feedback/statistics-feedback.component';
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

import { ListEventComponent } from './components/events/list-event/list-event.component';
import { FormEventComponent } from './components/events/form-event/form-event.component';
import { ListFaqComponent } from './components/faqs/list-faq/list-faq.component';
import { FormFaqComponent } from './components/faqs/form-faq/form-faq.component';
import { ListGameComponent } from './components/games/list-game/list-game.component';
import { FormGameComponent } from './components/games/form-game/form-game.component';
import { ListHotComponent } from './components/hots/list-hot/list-hot.component';
import { AddHotComponent } from './components/hots/add-hot/add-hot.component';
import { EditHotComponent } from './components/hots/edit-hot/edit-hot.component';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { AddPostComponent } from './components/posts/add-post/add-post.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { ListPromotionLabelComponent } from './components/promotion-labels/list-promotion-label/list-promotion-label.component';
import { AddPromotionLabelComponent } from './components/promotion-labels/add-promotion-label/add-promotion-label.component';
import { EditPromotionLabelComponent } from './components/promotion-labels/edit-promotion-label/edit-promotion-label.component';

import { HomeComponent } from './components/home/home.component';
import { PromotionFormDetailComponent } from './components/promotions/promotion-form-detail/promotion-form-detail.component';
import { ListPromotionComponent } from './components/promotions/list-promotion/list-promotion.component';
import { UserPromotionComponent } from './components/promotions/user-promotion/user-promotion.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './shared/guards/index';

import { UserPermissionComponent } from './components/user-permission/user-permission.component';
import { OpenTimeComponent } from './components/open-time/open-time.component'
import { PromotionReportComponent } from './components/promotions/promotion-report/promotion-report.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';


const routes: Routes = [{
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions',
        component: ListPromotionComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'users-promotions/:id',
        component: UserPromotionComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions/:id/change',
        component: PromotionFormDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions/add',
        component: PromotionFormDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-list',
        component: AdvertisementListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-detail/:id',
        component: AdvertisementDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-add',
        component: AdvertisementAddComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotion-type-list',
        component: PromotionTypeListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'denomination-add',
        component: DenominationAddComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'denomination-list',
        component: DenominationListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'feedback-list',
        component: FeedbackListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'feedback-detail/:id',
        component: FeedbackDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'hot-advs-add',
        component: HotAdvsAddComponent,
         canActivate: [AuthGuard]
    }, {
        path: 'hot-advs-list',
        component: HotAdvsListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-add',
        component: UserAddComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-list',
        component: UserListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-detail/:id',
        component: UserDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'link-card-list',
        component: LinkCardListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-add',
        component: BannerAddComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-list',
        component: BannerListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-detail/:id',
        component: BannerDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feedback/statistics',
        component: StatisticsFeedbackComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'link-card/add',
        component: AddLinkCardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'link-card/detail/:id',
        component: LinkCardDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/list',
        component: ListNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/add',
        component: AddNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/edit/:id',
        component: EditNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/detail/:id',
        component: NotificationDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fee/list',
        component: FeeListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fee/add',
        component: FeeAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/list',
        component: ListEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/add',
        component: FormEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/edit/:id',
        component: FormEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/list',
        component: ListFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/add',
        component: FormFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/edit/:id',
        component: FormFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/list',
        component: ListGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/add',
        component: FormGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/edit/:id',
        component: FormGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/list',
        component: ListHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/add',
        component: AddHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/edit/:id',
        component: EditHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/list',
        component: ListPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/add',
        component: AddPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/edit/:id',
        component: EditPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/list',
        component: ListPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/add',
        component: AddPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/edit/:id',
        component: EditPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'user-permission',
        component: UserPermissionComponent
    },
    {
        path: 'open-time',
        component: OpenTimeComponent
    },
    {
        path: 'promotions/report/:id',
        component: PromotionReportComponent
    },
    {
        path: 'role-permission',
        component: RolePermissionComponent
    },
    {
        path: 'error',
        component: ErrorComponent
    },

];
// imports: [ RouterModule.forRoot(routes, { useHash: true })],
@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
