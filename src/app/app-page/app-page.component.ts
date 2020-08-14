import { Component, OnInit } from '@angular/core';
import entries from './entries';
import { Entry } from '../shared/interfaces';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent implements OnInit {
  entries: Entry[];
  filteredEntries: Entry[];
  selectedDate: Date;

  constructor() {
    const now = new Date();
    this.selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }

  ngOnInit(): void {
    this.entries = entries;
    this.entries.sort((a, b) => {
      return +b.created_at - +a.created_at;
    });

    this.filterEntries();
  }

  filterEntries() {
    this.filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(+entry.created_at);

      const isMatched =
        entryDate.getMonth() === this.selectedDate.getMonth() &&
        entryDate.getFullYear() === this.selectedDate.getFullYear();

      return isMatched;
    });
  }

  dateChange(newDate: Date) {
    this.selectedDate = newDate;

    this.filterEntries();
  }
}
