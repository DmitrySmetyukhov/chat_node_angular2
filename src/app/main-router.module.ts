import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login.component";
import {ChatComponent} from "./chat/chat.component";
import {AuthGuard} from "./shared/services/guards/auth-guard.service";
import {ProfileComponent} from "./user/profile.component";
import {PageNotFoundComponent} from "./404/page-not-found.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'chat',
                component: ChatComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard]
            },
            {
                path: '**',
                component: PageNotFoundComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class MainRouterModule {

}