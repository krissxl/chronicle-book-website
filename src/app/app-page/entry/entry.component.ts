import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  @ViewChild('invisible') invBlock: ElementRef;
  time: Date;
  text: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

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

    console.log(this.text, inv.scrollHeight, target.scrollHeight);
    target.style.height = inv.scrollHeight + 25 + 'px';
  }
}
