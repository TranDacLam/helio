import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app.routing';
import { UsersComponent } from './components/users/users.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { FormUserAppComponent } from './components/link-card/form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from './components/link-card/form-user-embed/form-user-embed.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { AddNotificationComponent } from './components/notification/add-notification/add-notification.component';
import { EditNotificationComponent } from './components/notification/edit-notification/edit-notification.component';

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
    EditNotificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CKEditorModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
