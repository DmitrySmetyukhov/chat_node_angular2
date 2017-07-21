import {AuthService} from "../../shared/services/auth.service";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent{
    constructor(private authService: AuthService, private router: Router) {

    }

    login: string;
    password: string;

    goLogin() {
        this.authService.authenticate(this.login, this.password).subscribe(
            (result) => {
                console.log(result, 'result');
                this.authService.currentUser = result;
                this.router.navigate(['profile']);
            },
            (error) => {
                console.log(error, 'error');
            }
        )
    }

}