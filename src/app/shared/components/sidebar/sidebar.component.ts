import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { BackendResponse } from '../../interfaces';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  clickObserver(event) {
    if (!event.composedPath().includes(this.sidebar)) this.isOpened = false;
  }

  isOpened: Boolean = false;
  sidebar: HTMLElement;
  env = environment;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sidebar = document.querySelector('.sidebar');
  }

  async signOut() {
    const response: BackendResponse = await this.authService.signOut();

    if (!response.error) {
      this.router.navigate(['/auth', 'login']);
    }
  }

  toggleOpenState() {
    this.isOpened = !this.isOpened;
  }
}
