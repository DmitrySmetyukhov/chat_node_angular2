import {Injectable} from "@angular/core";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {AuthService} from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (state.url === '/login') {
            return !this.authService.getCurrentUser();
        }
        return !!this.authService.getCurrentUser();
    }
}