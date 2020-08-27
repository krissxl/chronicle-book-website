import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import { getFullDateName } from '../../scripts/date';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date;
  @Input() showOccupiedDays: boolean = true;
  days: number[];
  startWeekDay: number;
  monthsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  yearSelectorArray: number[] = [];
  isYearSelectorOpened: boolean = false;
  isMonthSelectorOpened: boolean = false;

  @Output('dateChange') dateChange = new EventEmitter<Date>();

  @HostListener('document:click', ['$event']) docClick(event: MouseEvent) {
    const path = event.composedPath();
    const yearSelector = document.querySelector('.year-selector');
    const yearButton = document.querySelector('.year');

    if (!path.includes(yearSelector) && !path.includes(yearButton))
      this.isYearSelectorOpened = false;

    const monthSelector = document.querySelector('.month-selector');
    const monthButton = document.querySelector('.month');

    if (!path.includes(monthSelector) && !path.includes(monthButton))
      this.isMonthSelectorOpened = false;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.today();
      this.dateChange.emit(this.selectedDate);
    } else {
      this.getMonthInfo();
    }
    this.setupYearSelector();
  }

  setupYearSelector() {
    const now = new Date();
    this.yearSelectorArray = [];
    for (let i = now.getFullYear() - 70; i <= now.getFullYear() + 70; i++) {
      this.yearSelectorArray.push(i);
    }
  }

  getMonthInfo(year?: number, month?: number): void {
    let time: Date;
    let startWeekDay: number;

    if (year && month) {
      time = new Date(year, month + 1, 0);
      startWeekDay = new Date(year, month, 1).getDay();
    } else {
      time = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth() + 1,
        0
      );
      startWeekDay = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ).getDay();
    }

    this.startWeekDay = startWeekDay;
    this.fillDaysArray(time.getDate());
  }

  checkDayOccupied(day: number): boolean {
    const date = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      day
    );
    const dateName = getFullDateName(date);

    return !!this.authService?.user?.entriesCount?.[dateName];
  }

  fillDaysArray(num: number): void {
    this.days = new Array(num + this.startWeekDay)
      .fill(0)
      .map((x, i) => i - this.startWeekDay + 1);
  }

  prevMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      this.selectedDate.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  prevYear() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear() - 1,
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  nextYear() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear() + 1,
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  selectYear(year: number): void {
    this.selectedDate = new Date(
      year,
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    );
    this.isYearSelectorOpened = false;
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  selectMonth(month: number): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      month,
      this.selectedDate.getDate()
    );
    this.isMonthSelectorOpened = false;
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  openCloseYearSelector() {
    this.isYearSelectorOpened = !this.isYearSelectorOpened;

    if (this.isYearSelectorOpened) {
      const selectedElem = document.querySelector('.year-element.selected');
      selectedElem.scrollIntoView();
    }
  }

  getDateByMonth(month: number) {
    return new Date(this.selectedDate.getFullYear(), month);
  }

  today() {
    const now = new Date();
    this.selectedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  selectDay(event: Event, day: number) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('empty-day')) {
      this.selectedDate = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        day
      );
    }
    this.dateChange.emit(this.selectedDate);
  }
}
