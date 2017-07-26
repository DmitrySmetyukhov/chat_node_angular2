import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpService} from "./shared/services/http.service";
import {AuthService} from "./shared/services/auth.service";
import {HomeComponent} from "./home/home.component";
import {MainRouterModule} from "./main-router.module";
import {LoginComponent} from "./auth/login.component";
import {ChatComponent} from "./chat/chat.component";
import {AuthGuard} from "./shared/services/guards/auth-guard.service";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileComponent} from "./user/profile.component";
import {PageNotFoundComponent} from "./404/page-not-found.component";
import {SocketIoService} from "./shared/services/socket-io.service";
import {AccordionModule} from "ngx-bootstrap";
import {MessagesFilter} from "./shared/pipes/messages-filter";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ChatComponent,
        ProfileComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        MainRouterModule,
        HttpModule,
        FormsModule,
        AccordionModule.forRoot(),
        ReactiveFormsModule
    ],
    providers: [
        HttpService,
        AuthService,
        AuthGuard,
        SocketIoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
