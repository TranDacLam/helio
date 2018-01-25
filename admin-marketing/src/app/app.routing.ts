import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'link-card/add', component: AddLinkCardComponent },
  { path: 'link-card/detail/:id', component: LinkCardDetailComponent },
  { path: 'notifications', component: ListNotificationComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
