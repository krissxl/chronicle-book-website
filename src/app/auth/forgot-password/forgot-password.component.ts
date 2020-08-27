import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { BackendResponse } from 'src/app/shared/interfaces';
import { auth } from 'firebase';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage: Subject<string> = new Subject()

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  async sendEmail() {
    const response: BackendResponse = await this.authService.sendResetEmail(
      this.email.value
    );

    if (!response.error) this.email.reset();
    this.errorMessage.next(response.message)
  } 
}
