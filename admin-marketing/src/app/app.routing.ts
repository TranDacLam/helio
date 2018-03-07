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

import { HomeComponent } from './components/home/home.component';
import { AddPromotionComponent } from './components/promotions/add-promotion/add-promotion.component';
import { EditPromotionComponent } from './components/promotions/edit-promotion/edit-promotion.component';
import { ListPromotionComponent } from './components/promotions/list-promotion/list-promotion.component';
import { UserPromotionComponent } from './components/promotions/user-promotion/user-promotion.component';
import { ErrorComponent } from './components/error/error.component';


const routes: Routes = [{
        path: '',
        component: HomeComponent
    }, {
        path: 'users',
        component: UsersComponent
    }, {
        path: 'promotions',
        component: ListPromotionComponent
    }, {
        path: 'users-promotions/:id',
        component: UserPromotionComponent
    }, {
        path: 'promotions/:id/change',
        component: EditPromotionComponent
    }, {
        path: 'promotions/add',
        component: AddPromotionComponent
    }, {
        path: 'advertisement-list',
        component: AdvertisementListComponent
    }, {
        path: 'advertisement-detail/:id',
        component: AdvertisementDetailComponent
    }, {
        path: 'advertisement-add',
        component: AdvertisementAddComponent
    }, {
        path: 'promotion-type-list',
        component: PromotionTypeListComponent
    }, {
        path: 'denomination-add',
        component: DenominationAddComponent
    }, {
        path: 'denomination-list',
        component: DenominationListComponent
    }, {
        path: 'feedback-list',
        component: FeedbackListComponent
    }, {
        path: 'feedback-detail/:id',
        component: FeedbackDetailComponent
    }, {
        path: 'hot-advs-add',
        component: HotAdvsAddComponent
    }, {
        path: 'hot-advs-list',
        component: HotAdvsListComponent
    }, {
        path: 'user-add',
        component: UserAddComponent
    }, {
        path: 'user-list',
        component: UserListComponent
    }, {
        path: 'user-detail/:id',
        component: UserDetailComponent
    }, {
        path: 'link-card-list',
        component: LinkCardListComponent
    }, {
        path: 'banner-add',
        component: BannerAddComponent
    }, {
        path: 'banner-list',
        component: BannerListComponent
    }, {
        path: 'banner-detail/:id',
        component: BannerDetailComponent
    },
    {
        path: 'feedback/statistics',
        component: StatisticsFeedbackComponent
    },
    {
        path: 'link-card/add',
        component: AddLinkCardComponent
    },
    {
        path: 'link-card/detail/:id',
        component: LinkCardDetailComponent
    },
    {
        path: 'notification/list',
        component: ListNotificationComponent
    },
    {
        path: 'notification/add',
        component: AddNotificationComponent
    },
    {
        path: 'notification/edit/:id',
        component: EditNotificationComponent
    },
    {
        path: 'notification/detail/:id',
        component: NotificationDetailComponent
    },
    {
        path: 'fee/list',
        component: FeeListComponent
    },
    {
        path: 'fee/add',
        component: FeeAddComponent
    },
    {
        path: 'event/list',
        component: ListEventComponent
    },
    {
        path: 'event/add',
        component: AddEventComponent
    },
    {
        path: 'event/edit/:id',
        component: EditEventComponent
    },
    {
        path: 'faq/list',
        component: ListFaqComponent
    },
    {
        path: 'faq/add',
        component: AddFaqComponent
    },
    {
        path: 'faq/edit/:id',
        component: EditFaqComponent
    },
    {
        path: 'game/list',
        component: ListGameComponent
    },
    {
        path: 'game/add',
        component: AddGameComponent
    },
    {
        path: 'game/edit/:id',
        component: EditGameComponent
    },
    {
        path: 'hot/list',
        component: ListHotComponent
    },
    {
        path: 'hot/add',
        component: AddHotComponent
    },
    {
        path: 'hot/edit/:id',
        component: EditHotComponent
    },
    {
        path: 'post/list',
        component: ListPostComponent
    },
    {
        path: 'post/add',
        component: AddPostComponent
    },
    {
        path: 'post/edit/:id',
        component: EditPostComponent
    },
    {
        path: 'promotion-label/list',
        component: ListPromotionLabelComponent
    },
    {
        path: 'promotion-label/add',
        component: AddPromotionLabelComponent
    },
    {
        path: 'promotion-label/edit/:id',
        component: EditPromotionLabelComponent
    },
    {
        path: 'error',
        component: ErrorComponent
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
