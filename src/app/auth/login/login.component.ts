import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { BackendResponse } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage: Subject<string> = new Subject();
  waiting: Boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  async signIn(event: Event) {
    event.preventDefault();

    this.waiting = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const response: BackendResponse = await this.authService.signIn(
      email,
      password
    );

    if (response.error) {
      this.errorMessage.next(response.message);
    } else {
      this.router.navigate(['/app']);
    }

    this.waiting = false;
  }

  redirectToSignUp() {
    this.router.navigate(['/auth/register']);
  }
}
