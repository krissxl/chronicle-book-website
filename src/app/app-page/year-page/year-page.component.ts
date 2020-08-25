import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/app/shared/services/entries.service';
import { AuthService } from 'src/app/shared/auth.service';
import { getFullDateName } from 'src/app/shared/scripts/date';
import { Entry } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-year-page',
  templateUrl: './year-page.component.html',
  styleUrls: ['./year-page.component.scss'],
})
export class YearPageComponent implements OnInit {
  selectedYear: Date = new Date();
  selectedDate: Date;
  days: number[] = [];
  maxInDay: number = 0;
  entriesOnSelected: Entry[] = [];
  startOfYear: number;
  selectedEntry: Entry;

  constructor(
    public entriesService: EntriesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateArrayOfDays();
  }

  /* Generate an array of days for grid 
  (-1 is an empty cell (depends on which week day starts year),
   >= 0 is a number of entries on this day) and find max entries on a day */
  generateArrayOfDays(): void {
    // Adding empty cells
    const year = this.selectedYear.getFullYear();
    this.startOfYear = new Date(year, 0, 1).getDay();
    for (let i = 0; i < this.startOfYear; i++) {
      this.days.push(-1);
    }

    let max = 0;
    for (let i = 0; i < 12; i++) {
      const daysInMonth = new Date(year, i + 1, 0).getDate();

      for (let j = 1; j <= daysInMonth; j++) {
        const date = new Date(year, i, j);
        const dateName = getFullDateName(date);
        const entriesCount = this.authService.user.entriesCount[dateName];
        max = entriesCount > max ? entriesCount : max;

        this.days.push(entriesCount ? entriesCount : 0);
      }
    }

    this.maxInDay = max;
  }

  // Call when user clicks on a cell of day in grid
  onDayClick(event: Event, indexInArray: number): void {
    const target = event.target as HTMLElement;

    if (target.classList.contains('selected')) {
      this.selectedDate = null;
      this.entriesOnSelected = [];
      target.classList.remove('selected');
    } else {
      const selectedDay = document.querySelector('.day-cell.selected');
      if (selectedDay) selectedDay.classList.remove('selected')

      this.selectedDate = this.getDayDate(indexInArray);
      this.fetchEntriesByDay();
      target.classList.add('selected');
    }
  }

  // Return a date of day (by index in days array)
  getDayDate(indexInArray: number): Date {
    const year = this.selectedYear.getFullYear();
    return new Date(year, 0, indexInArray - this.startOfYear + 1);
  }

  // Fetch entries on selected by user day
  async fetchEntriesByDay(): Promise<void> {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const day = this.selectedDate.getDate();

    let entries = this.entriesService.getEntriesByDate(this.selectedDate);

    if (!entries) {
      await this.entriesService.fetchUserEntriesByMonth(this.selectedDate);
      entries = this.entriesService.getEntriesByDate(this.selectedDate);

      if (!entries) this.entriesOnSelected = null;
    }

    const startOfDay = new Date(year, month, day);
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

    this.entriesOnSelected = entries.filter(
      (entry: Entry) =>
        entry.time.getTime() >= startOfDay.getTime() &&
        entry.time.getTime() <= endOfDay.getTime()
    );
  }

  closeEntry() {
    if (event.currentTarget === event.target) {
      this.selectedEntry = null;
    }
  }
}
