import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntriesService } from '../shared/services/entries.service';
import { EntryService } from '../shared/services/entry.service';
import { Entry } from '../shared/interfaces';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent implements OnInit {
  selectedDate: Date;
  selectedEntry: Entry;
  occupiedDays: number[];

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
    await this.entriesService.fetchUserEntriesByDate(this.selectedDate);
    this.occupiedDays = this.entriesService.getOccupiedDays(this.selectedDate);
  }

  navigateToEntry() {
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

  navigateToEditEntry() {
    this.entryService.reset();
    this.entryService.setEntry(this.selectedEntry);
    this.router.navigate(['/app', 'entry', { id: this.selectedEntry.id }]);
  }

  selectEntry(entry: Entry) {
    this.selectedEntry = entry;
  }

  async deleteEntry() {
    this.entryService.setEntry(this.selectedEntry);
    const response = await this.entryService.deleteEntry();

    if (!response.error) {
      const date = this.entryService.entryTime;
      const id = this.entryService.entryId;
      this.entriesService.deleteEntry(date, id);
      
      this.entryService.reset();
      this.selectedEntry = undefined;
      await this.entriesService.fetchUserEntriesByDate(this.selectedDate);
      this.occupiedDays = this.entriesService.getOccupiedDays(this.selectedDate);
    }
  }

  closeEntry(event: Event) {
    if (event.currentTarget === event.target) {
      this.selectedEntry = null;
    }
  }

  async dateChange(newDate: Date) {
    if (
      this.selectedDate.getFullYear() !== newDate.getFullYear() ||
      this.selectedDate.getMonth() !== newDate.getMonth()
    ) {
      await this.entriesService.fetchUserEntriesByDate(newDate);
      this.occupiedDays = this.entriesService.getOccupiedDays(newDate);
    }

    this.selectedDate = newDate;
  }
}
