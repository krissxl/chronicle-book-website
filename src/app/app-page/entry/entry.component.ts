import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { EntryService } from 'src/app/shared/services/entry.service';
import { EntriesService } from 'src/app/shared/services/entries.service';
import { BackendResponse } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  @ViewChild('invisible') invBlock: ElementRef;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.fetchEntry(params.id);
      }
      if (params.time) {
        this.entryService.entryCreated = new Date(+params.time);
      }
    });
  }

  resizeTrigger(event) {
    const inv = this.invBlock.nativeElement as HTMLElement;
    const target = event.target as HTMLElement;

    inv.innerText = this.entryService.entryText;

    target.style.height = inv.scrollHeight + 25 + 'px';
  }

  async fetchEntry(id: string) {
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

  async update() {
    const response: BackendResponse = await this.entryService.updateEntry();

    if (!response.error) {
      this.router.navigate(['/app']);
    }
  }

  async create() {
    const response: BackendResponse = await this.entryService.createNewEntry();

    if (!response.error) {
      this.entryService.reset();
      this.router.navigate(['/app']);
    }
  }

  cancel() {
    this.entryService.reset();
    this.router.navigate(['/app']);
  }

  async deleteEntry() {
    const response: BackendResponse = await this.entryService.deleteEntry();

    if (!response.error) {
      this.entryService.reset();
      this.router.navigate(['/app']);
    }
  }
}
