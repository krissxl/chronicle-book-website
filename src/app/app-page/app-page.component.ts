import { Component, OnInit } from '@angular/core';
import entries from './entries';
import { Entry } from '../shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent implements OnInit {
  entries: Entry[];
  filteredEntries: Entry[];
  selectedDate: Date;

  constructor(private router: Router) {
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

  navigateToEntry() {
    const time = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      new Date().getHours(),
      new Date().getMinutes()
    ).getTime()
    this.router.navigate(['/app', 'entry', {time}])
  }

  dateChange(newDate: Date) {
    this.selectedDate = newDate;

    this.filterEntries();
  }
}
