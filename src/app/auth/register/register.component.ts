import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { BackendResponse } from 'src/app/shared/interfaces';
import { interval, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    again: new FormControl('', [Validators.required]),
  });

  errorMessage: String = '';
  waiting: Boolean = false;
  errorTimer: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  async signUp(event: Event) {
    event.preventDefault();

    this.waiting = true;

    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const again = this.registerForm.value.again;

    if (password === again) {
      const response: BackendResponse = await this.authService.signUpUser(
        email,
        password,
        username
      );
      if (response.error) {
        this.errorMessage = response.message;

        this.startErrorTimer();
      } else {
        this.router.navigate(['/app']);
      }
    } else {
      this.errorMessage = "Passwords aren't match";

      this.startErrorTimer();
    }

    this.waiting = false;
  }

  startErrorTimer() {
    if (this.errorTimer) {
      this.errorTimer.unsubscribe();
    }

    this.errorTimer = interval(4000)
      .pipe(take(1))
      .subscribe(() => (this.errorMessage = ''));
  }

  redirectToSignIn() {
    this.router.navigate(['/auth', 'login']);
  }
}
