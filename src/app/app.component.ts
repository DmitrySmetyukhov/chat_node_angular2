import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    constructor(private router: Router, private authService: AuthService) {
    }

    isAuthorized() {
        return !!this.authService.currentUser;
    }

    goLogin(event) {
        event.preventDefault();
        this.router.navigate(['login']);
    }

    logout(event) {
        event.preventDefault();
        this.authService.logout();
    }

    goChat(event) {
        event.preventDefault();
        this.router.navigate(['chat']);
    }

    goProfile(event) {
        event.preventDefault();
        this.router.navigate(['profile']);
    }

    goHome(event) {
        event.preventDefault();
        this.router.navigate(['home']);
    }
}
