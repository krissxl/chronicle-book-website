import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  clickObserver(event) {
    if (!event.composedPath().includes(this.sidebar)) this.isOpened = false;
  }

  isOpened: Boolean = false
  sidebar: HTMLElement

  constructor() { }

  ngOnInit(): void {
    this.sidebar = document.querySelector('.sidebar')
  }

  toggleOpenState() {
    this.isOpened = !this.isOpened;
  }

  
}
