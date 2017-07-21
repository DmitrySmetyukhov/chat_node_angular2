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

    public authenticate(login: string, password: string) {
        return this.http.post(this.authenticateUrl, {login: login, password: password})
            .map(this.extractUser)
    }

    public logout() {
        this.currentUser = null; //temporary
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