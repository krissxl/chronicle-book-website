import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url === '/auth') this.router.navigate(['/auth', 'login']);
  }
}
