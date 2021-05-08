import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Entry } from '../../interfaces';
import { EntryService } from '../../services/entry.service';
import { Router } from '@angular/router';
import { EntriesService } from '../../services/entries.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-entry-modal',
  templateUrl: './entry-modal.component.html',
  styleUrls: ['./entry-modal.component.scss'],
  animations: [
    trigger('inOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease', style({ opacity: 1 })),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EntryModalComponent implements OnInit {
  @Input() entry: Entry;
  @Output('onClose') onClose = new EventEmitter();
  @Output('onDelete') onDelete = new EventEmitter();

  constructor(
    private entryService: EntryService,
    private router: Router,
    private entriesService: EntriesService
  ) {}

  ngOnInit(): void {}

  navigateToEditEntry(): void {
    this.entryService.reset();
    this.entryService.setEntry(this.entry);
    this.router.navigate(['/app', 'entry', { id: this.entry.id }]);
  }

  async deleteEntry() {
    this.entryService.setEntry(this.entry);
    const response = await this.entryService.deleteEntry();

    if (!response.error) {
      const date = this.entryService.entryTime;
      const id = this.entryService.entryId;
      this.entriesService.deleteEntry(date, id);

      this.entryService.reset();
      this.onDelete.emit();
    }
  }

  navigateToTagSearch(tag: string) {
    this.router.navigate([
      '/app',
      'search',
      { tag, mode: 'year', date: this.entry.time.getTime() },
    ]);
  }
}
