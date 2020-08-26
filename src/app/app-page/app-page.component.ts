import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { EntriesService } from '../shared/services/entries.service';
import { EntryService } from '../shared/services/entry.service';
import { Entry } from '../shared/interfaces';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent implements OnInit {
  @ViewChild('side') side: ElementRef;

  selectedDate: Date;
  selectedEntry: Entry;
  isSideOpened: boolean = false;
  search: string;
  searchMode: string = 'month';
  isLoading: boolean = true;
  errorMessage: Subject<string> = new Subject();

  @HostListener('document:click', ['$event'])
  clickObserver(event: Event) {
    const path = event.composedPath();
    if (!path.includes(this.side.nativeElement)) this.isSideOpened = false;

    const searchBlock = document.querySelector('.search-block');
    if (!path.includes(searchBlock)) searchBlock.classList.remove('active');
  }

  constructor(
    private router: Router,
    public entriesService: EntriesService,
    private entryService: EntryService
  ) {
    const now = new Date();
    this.selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }

  async ngOnInit(): Promise<void> {
    const response = await this.entriesService.fetchUserEntriesByMonth(
      this.selectedDate
    );
    if (response.error) this.errorMessage.next(response.message);
    this.isLoading = false;
  }

  toggleSideState() {
    this.isSideOpened = !this.isSideOpened;
  }

  navigateToEntry(): void {
    this.entryService.reset();

    const time = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      new Date().getHours(),
      new Date().getMinutes()
    ).getTime();

    this.router.navigate(['/app', 'entry', { time }]);
  }

  setActive(event: Event) {
    const searchBlock: HTMLElement = (event.currentTarget as HTMLElement)
      .parentElement;
    searchBlock.classList.add('active');
  }

  navigateToSearch(): void {
    if (!this.search) return;
    this.router.navigate([
      '/app',
      'search',
      {
        q: this.search,
        mode: this.searchMode,
        date: this.selectedDate.getTime(),
      },
    ]);
  }

  selectEntry(entry: Entry) {
    this.selectedEntry = entry;
  }

  closeEntry(event: Event) {
    if (event.currentTarget === event.target) {
      this.selectedEntry = null;
    }
  }

  deleteEntry() {
    this.selectedEntry = undefined;
  }

  async dateChange(newDate: Date) {
    if (
      this.selectedDate.getFullYear() !== newDate.getFullYear() ||
      this.selectedDate.getMonth() !== newDate.getMonth()
    ) {
      this.isLoading = true;
      const response = await this.entriesService.fetchUserEntriesByMonth(
        newDate
      );
      if (response.error) this.errorMessage.next(response.message);
      this.isLoading = false;
    }

    this.selectedDate = newDate;
  }
}
