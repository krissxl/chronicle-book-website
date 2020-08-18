import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntriesService } from '../shared/services/entries.service';
import { Entry } from '../shared/interfaces';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent implements OnInit {
  selectedDate: Date;
  selectedEntry: Entry;

  constructor(private router: Router, public entriesService: EntriesService) {
    const now = new Date();
    this.selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }

  async ngOnInit(): Promise<void> {
    await this.entriesService.fetchUserEntriesByDate(this.selectedDate);
  }

  navigateToEntry() {
    const time = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      new Date().getHours(),
      new Date().getMinutes()
    ).getTime();
    this.router.navigate(['/app', 'entry', { time }]);
  }

  selectEntry(entry: Entry) {
    this.selectedEntry = entry;
  }

  closeEntry(event: Event) {
    if (event.currentTarget == event.target) {
      this.selectedEntry = null;
    }
  }

  async dateChange(newDate: Date) {
    if (
      this.selectedDate.getFullYear() !== newDate.getFullYear() ||
      this.selectedDate.getMonth() !== newDate.getMonth()
    ) {
      await this.entriesService.fetchUserEntriesByDate(newDate);
    }

    this.selectedDate = newDate;
  }
}
