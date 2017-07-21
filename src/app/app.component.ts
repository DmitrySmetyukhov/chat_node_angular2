import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private authService: AuthService) {
    }

    isAuthorized() {
        return !!this.authService.currentUser;
    }

    logout(event) {
        event.preventDefault();
        this.authService.logout();
    }


}
