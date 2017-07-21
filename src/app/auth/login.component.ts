import {AuthService} from "../../shared/services/auth.service";
import {Component} from "@angular/core";
@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent{
    constructor(private authService: AuthService) {

    }

    login: string;
    password: string;

    goLogin() {
        this.authService.authenticate(this.login, this.password).subscribe(
            (result) => {
                console.log(result, 'result');
                this.authService.currentUser = result;
            },
            (error) => {
                console.log(error, 'error');
            }
        )
    }

}