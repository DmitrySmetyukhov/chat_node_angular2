import {AuthService} from "../shared/services/auth.service";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../shared/models/user";
@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent{
    constructor(private authService: AuthService, private router: Router) {
        console.log('login component')
    }

    login: string;
    password: string;

    goLogin() {
        this.authService.authenticate(this.login, this.password).subscribe(
            (result) => {


                console.log(result, 'result');

                if(result){
                    this.authService.currentUser = result;
                    this.router.navigate(['profile']);
                    localStorage.setItem('fcCurrentUser', result.toString());
                }


            },
            (error) => {
                console.log(error, 'error');
            }
        )
    }

}