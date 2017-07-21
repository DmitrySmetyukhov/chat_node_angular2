import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";
@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit{
    constructor(private authService: AuthService){

    }

    ngOnInit(){

    }

}