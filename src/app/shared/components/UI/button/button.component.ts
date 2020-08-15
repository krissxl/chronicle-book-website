import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Output('click') click = new EventEmitter();
  @Input() color: String = 'blue';
  @Input() type: String = 'button';
  @Input() disabled: Boolean = false;
  @Input() center: Boolean = false;
  @Input() fullsize: Boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
