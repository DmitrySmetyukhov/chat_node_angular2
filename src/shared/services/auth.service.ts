import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {User} from "../models/user";
import {Response} from "@angular/http";

@Injectable()
export class AuthService {
    public currentUser: User;
    private authenticateUrl = 'http://localhost:3000/login';

    constructor(private http: HttpService) {
    }

    public authenticate(login: string, password: string) {
        return this.http.post(this.authenticateUrl, {login: login, password: password})
            .map(this.extractUser)
    }

    public logout() {
        this.currentUser = null; //temporary
    }

    private extractUser(response: Response) {
        let res = response.json();

        if (res.length) {
            return {
                id: res[0]._id,
                login: res[0].login,
                password: res[0].password
            }
        }

        return null;
    }
}