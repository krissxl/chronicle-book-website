import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entry } from '../../interfaces';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date;
  @Input() occupiedDays: number[];
  days: number[];
  startWeekDay: number;

  @Output('dateChange') dateChange = new EventEmitter<Date>();

  constructor() {}

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

  fillDaysArray(num: number): void {
    this.days = new Array(num + this.startWeekDay)
      .fill(0)
      .map((x, i) => i - this.startWeekDay + 1);
  }

  prevMonth() {
    const isJanuary = this.selectedDate.getMonth() === 0;

    const selectedYear = isJanuary
      ? this.selectedDate.getFullYear() - 1
      : this.selectedDate.getFullYear();
    const selectedMonth = isJanuary ? 11 : this.selectedDate.getMonth() - 1;

    this.selectedDate = new Date(
      selectedYear,
      selectedMonth,
      this.selectedDate.getDate()
    );
    this.getMonthInfo();

    this.dateChange.emit(this.selectedDate);
  }

  nextMonth() {
    const isDecember = this.selectedDate.getMonth() === 11;

    const selectedYear = isDecember
      ? this.selectedDate.getFullYear() + 1
      : this.selectedDate.getFullYear();
    const selectedMonth = isDecember ? 0 : this.selectedDate.getMonth() + 1;

    this.selectedDate = new Date(
      selectedYear,
      selectedMonth,
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

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.today();
      this.dateChange.emit(this.selectedDate);
    } else {
      this.getMonthInfo();
    }
  }
}
