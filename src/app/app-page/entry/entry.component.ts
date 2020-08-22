import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from 'src/app/shared/services/entry.service';
import { BackendResponse } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  @ViewChild('invisible') invBlock: ElementRef;
  @ViewChild('calendar') calendar: ElementRef;
  @ViewChild('hours') hoursInput: ElementRef;
  @ViewChild('minutes') minutesInput: ElementRef;
  @ViewChild('am') amRadio: ElementRef;
  @ViewChild('pm') pmRadio: ElementRef;

  loading: boolean = false;
  isCalendarOpened: boolean = false;
  isTimeSelectorOpened: boolean = false;
  tagInput: string;

  @HostListener('document:click', ['$event']) docClick(event: Event): void {
    const path = event.composedPath();

    if (this.isCalendarOpened) {
      const dayLine: HTMLElement = document.querySelector('.line-1');
      if (
        !path.includes(this.calendar.nativeElement) &&
        !path.includes(dayLine)
      ) {
        this.isCalendarOpened = false;
      }
    }

    if (this.isTimeSelectorOpened) {
      const timeLine = document.querySelector('.date-time');
      const timeSelectorBlock = document.querySelector('.time-selector-block');
      if (!path.includes(timeLine) && !path.includes(timeSelectorBlock)) {
        this.isTimeSelectorOpened = false;
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.fetchEntry(params.id);
        return;
      }
      if (params.time) {
        this.entryService.setNewDate(new Date(+params.time));
        return;
      }
    });
  }

  resizeTrigger(event: Event): void {
    const inv = this.invBlock.nativeElement as HTMLElement;
    const target = event.target as HTMLTextAreaElement;

    inv.innerText = this.entryService.entryText;
    const hght = inv.scrollHeight ? inv.scrollHeight : 25;

    target.style.height = hght + 24 + 'px';
  }

  async fetchEntry(id: string): Promise<void> {
    this.loading = true;
    const response: BackendResponse = await this.entryService.fetchEntry(id);
    this.loading = false;

    if (!response.error) {
      const inv = document.querySelector('.invisible-write') as HTMLElement;
      const textarea = document.querySelector('.write') as HTMLElement;

      inv.innerText = this.entryService.entryText;

      textarea.style.height = inv.scrollHeight + 25 + 'px';
    } else {
      this.router.navigate(['/app']);
    }
  }

  async update(): Promise<void> {
    const response: BackendResponse = await this.entryService.updateEntry();

    if (!response.error) {
      this.entryService.reset();
      this.router.navigate(['/app']);
    }
  }

  async create(): Promise<void> {
    const response: BackendResponse = await this.entryService.createNewEntry();

    if (!response.error) {
      this.entryService.reset();
      this.router.navigate(['/app']);
    }
  }

  cancel(): void {
    this.entryService.reset();
    this.router.navigate(['/app']);
  }

  async deleteEntry(): Promise<void> {
    const response: BackendResponse = await this.entryService.deleteEntry();

    if (!response.error) {
      this.entryService.reset();
      this.router.navigate(['/app']);
    }
  }

  dateChange(newDate: Date): void {
    this.entryService.setNewDate(newDate);
  }

  minutesInputTrigger(event: InputEvent): void {
    let hours = +(this.hoursInput.nativeElement as HTMLInputElement).value;
    hours = hours === 12 ? 0 : hours;
    if ((this.pmRadio.nativeElement as HTMLInputElement).checked) hours += 12;

    const minutes = +(event.target as HTMLInputElement).value;

    if (minutes <= 59) {
      this.entryService.setNewTime({ hours, minutes });
    }
  }

  hoursInputTrigger(event: Event): void {
    let hours = +(event.target as HTMLInputElement).value;
    if (!hours) {
      return;
    }
    const minutes = +(this.minutesInput.nativeElement as HTMLInputElement)
      .value;

    if (hours <= 12) {
      hours = hours === 12 ? 0 : hours;
      if ((this.pmRadio.nativeElement as HTMLInputElement).checked) hours += 12;

      this.entryService.setNewTime({ hours: +hours, minutes: +minutes });
    }
  }

  amTrigger(): void {
    let hours = +(this.hoursInput.nativeElement as HTMLInputElement).value;
    hours = hours ? hours : 0;
    const minutes = +(this.minutesInput.nativeElement as HTMLInputElement)
      .value;
    if (hours <= 11 && minutes <= 59) {
      this.entryService.setNewTime({ hours: +hours, minutes: +minutes });
    } else {
      this.entryService.setNewTime({ hours: 0, minutes: 0 });
    }
  }

  pmTrigger(): void {
    let hours = +(this.hoursInput.nativeElement as HTMLInputElement).value;
    const minutes = +(this.minutesInput.nativeElement as HTMLInputElement)
      .value;
    if (hours <= 11 && minutes <= 59) {
      this.entryService.setNewTime({ hours: +hours + 12, minutes: +minutes });
    } else {
      this.entryService.setNewTime({ hours: 0, minutes: 0 });
    }
  }

  tagKeydownTrigger(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addNewTag();
    }
  }

  tagInputTrigger(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const spaceIndex: number = this.tagInput.indexOf(' ');

    this.tagInput =
      spaceIndex !== -1
        ? this.tagInput.substring(0, spaceIndex).trim()
        : this.tagInput.trim();

    target.value = this.tagInput;
  }

  addNewTag() {
    if (!this.entryService.entryTags.includes(this.tagInput.toLowerCase()) && this.tagInput) {
      this.entryService.addTag(this.tagInput.toLowerCase());

      this.tagInput = '';
    }
  }
}
