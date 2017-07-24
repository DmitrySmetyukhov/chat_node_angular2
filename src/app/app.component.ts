import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./shared/services/auth.service";
import {SocketIoService} from "./shared/services/socket-io.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private authService: AuthService,
                private router: Router,
                private socketIoService: SocketIoService) {
        console.log('app component');
    }

    ngOnInit() {
        this.authService.currentUserBackup();
    }

    isAuthorized() {
        return !!this.authService.currentUser;
    }

    logout(event) {
        event.preventDefault();
        this.authService.logout().subscribe(
            () => {
                this.authService.currentUser = null;
                this.socketIoService.disconnect();
                this.router.navigate(['login']);
            },
            (err) => {
            }
        );
    }


}
