import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {User} from "../models/user";
import {Response} from "@angular/http";


@Injectable()
export class AuthService {
    public currentUser: User;
    private authenticateUrl = 'http://localhost:3000/login';
    private logoutUrl = 'http://localhost:3000/logout';

    constructor(private http: HttpService) {
    }

    public currentUserBackup(){
        let str = localStorage.getItem('fcCurrentUser');
        if (str) {
            let tmp = str.split(';');
            this.currentUser =  new User(tmp[0], tmp[1])
        }
        return this.currentUser;
    }



    public authenticate(login: string, password: string) {
        return this.http.post(this.authenticateUrl, {login: login, password: password})
            .map(this.extractUser)
    }

    public getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        return this.currentUserBackup();
    }

    public logout() {
        this.currentUser = null;
        localStorage.removeItem('fcCurrentUser');
        return this.http.post(this.logoutUrl, {});
    }

    private extractUser(response: Response) {
        let res = response.json();

        if (res) {
            return new User(res._id, res.username);
        }
        return null;
    }
}