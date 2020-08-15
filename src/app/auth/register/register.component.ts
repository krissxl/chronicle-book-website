import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  signUp(event: Event) {
    event.preventDefault();
    console.log(this.registerForm);
  }

  redirectToSignIn() {
    this.router.navigate(['/auth/login']);
  }
}
