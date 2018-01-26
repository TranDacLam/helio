import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
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
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
