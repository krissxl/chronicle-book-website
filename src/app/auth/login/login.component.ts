import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signIn(event: Event) {
    event.preventDefault();
    console.log(this.loginForm);
  }

  redirectToSignUp() {
    this.router.navigate(['/auth/register'])
  }
}
