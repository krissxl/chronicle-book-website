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
import { EntriesService } from 'src/app/shared/services/entries.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-entry-page',
  templateUrl: './entry-page.component.html',
  styleUrls: ['./entry-page.component.scss'],
})
export class EntryPageComponent implements OnInit {
  @ViewChild('invisible') invBlock: ElementRef;
  @ViewChild('calendar') calendar: ElementRef;
  @ViewChild('hours') hoursInput: ElementRef;
  @ViewChild('minutes') minutesInput: ElementRef;
  @ViewChild('am') amRadio: ElementRef;
  @ViewChild('pm') pmRadio: ElementRef;

  isCalendarOpened: boolean = false;
  isTimeSelectorOpened: boolean = false;
  tagInput: string;
  isLoading: boolean = true;
  error: Subject<string> = new Subject();

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
    public entryService: EntryService,
    private entriesService: EntriesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      if (params.id) {
        await this.fetchEntry(params.id);
      } else if (params.time) {
        this.entryService.setNewDate(new Date(+params.time));
        this.isLoading = false;
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
    this.isLoading = true;
    const response: BackendResponse = await this.entryService.fetchEntry(id);

    if (!response.error) {
      const inv = document.querySelector('.invisible-write') as HTMLElement;
      const textarea = document.querySelector('.write') as HTMLElement;

      inv.innerText = this.entryService.entryText;

      textarea.style.height = inv.scrollHeight + 25 + 'px';
      this.isLoading = false;
    } else {
      this.error.next(response.message);
      setTimeout(() => this.router.navigate(['/app']), 2250);
    }
  }

  async update(): Promise<void> {
    this.isLoading = true;
    const response: BackendResponse = await this.entryService.updateEntry();
    this.isLoading = false;

    if (!response.error) {
      this.entriesService.updateEntry(response.data.entry);

      this.entryService.reset();
      this.router.navigate(['/app']);
    } else {
      this.error.next(response.message);
    }
  }

  async create(): Promise<void> {
    if (!this.entryService.entryText) {
      this.error.next('In entry text must be at least one character');
      return;
    }

    this.isLoading = true;
    const response: BackendResponse = await this.entryService.createNewEntry();
    this.isLoading = false;

    if (!response.error) {
      this.entriesService.addEntry(response.data.entry);

      this.entryService.reset();
      this.router.navigate(['/app']);
    } else {
      this.error.next(response.message);
    }
  }

  cancel(): void {
    this.entryService.reset();
    this.router.navigate(['/app']);
  }

  async deleteEntry(): Promise<void> {
    this.isLoading = true;
    const response: BackendResponse = await this.entryService.deleteEntry();
    this.isLoading = false;

    if (!response.error) {
      const date = this.entryService.entryTime;
      const id = this.entryService.entryId;
      this.entriesService.deleteEntry(date, id);

      this.entryService.reset();
      this.router.navigate(['/app']);
    } else {
      this.error.next(response.message);
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
    if (
      !this.entryService.entryTags.includes(this.tagInput.toLowerCase()) &&
      this.tagInput
    ) {
      this.entryService.addTag(this.tagInput.toLowerCase());

      this.tagInput = '';
    }
  }
}
