import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth.service';
import { getFullDateName } from '../../scripts/date';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date;
  @Input() occupiedDays: number[];
  @Input() showOccupiedDays: boolean = true;
  days: number[];
  startWeekDay: number;

  @Output('dateChange') dateChange = new EventEmitter<Date>();

  constructor(private authService: AuthService) {}

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
    const date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), day);
    const dateName = getFullDateName(date);

    return !!this.authService.user.entriesCount[dateName]
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
