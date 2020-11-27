import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../+state/app.state';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    isCollapsed = true;

    constructor(public store$: Store<AppState>, public router: Router, public messageService: MessageService) {
    }
}