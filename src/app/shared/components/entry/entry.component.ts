import { Component, OnInit, Input } from '@angular/core';
import { Entry } from '../../interfaces';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  @Input() entry: Entry;

  constructor() { }

  ngOnInit(): void {
  }

}
