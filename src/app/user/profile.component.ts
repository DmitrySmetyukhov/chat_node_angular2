import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";
import {User} from "../shared/models/user";
@Component({
    templateUrl: 'profile.component.html'
})

export class ProfileComponent implements OnInit {
    constructor(private authService: AuthService) {
    }
    user: User;

    ngOnInit() {
        this.user = this.authService.currentUser;
    }

}