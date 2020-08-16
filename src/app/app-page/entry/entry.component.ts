import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  time: Date;
  text: String = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.time) {
        this.time = new Date(+params.time);
      }
    })
  }

  inputTriger(event) {
    const target = event.target as HTMLElement
    target.style.height = target.scrollHeight + 'px';
  }
}
