import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry, BackendResponse } from 'src/app/shared/interfaces';
import { addNewEntry } from '../../shared/api/firebase';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  @ViewChild('invisible') invBlock: ElementRef;
  time: Date;
  text: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.time) {
        this.time = new Date(+params.time);
      }
    });
  }

  resizeTrigger(event) {
    const inv = this.invBlock.nativeElement as HTMLElement;
    const target = event.target as HTMLElement;

    inv.innerText = this.text;

    target.style.height = inv.scrollHeight + 25 + 'px';
  }

  async createNewEntry() {
    const entry: Entry = { created_at: this.time, text: this.text };

    const response: BackendResponse = await addNewEntry(
      this.authService.user.id,
      entry
    );

    if (!response.error) {
      this.router.navigate(['/app']);
    }
  }
}
