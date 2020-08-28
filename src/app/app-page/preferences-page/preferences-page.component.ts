import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { PreferencesService } from '../../shared/services/preferences.service';
import { BackendResponse } from 'src/app/shared/interfaces';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences-page',
  templateUrl: './preferences-page.component.html',
  styleUrls: ['./preferences-page.component.scss'],
})
export class PreferencesPageComponent implements OnInit {
  errorMessage: Subject<string> = new Subject();

  constructor(
    public authService: AuthService,
    public preferencesService: PreferencesService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  fontSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    localStorage.setItem('font', target.value);
    this.preferencesService.font = target.value;
  }

  fontSizeSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    localStorage.setItem('font-size', target.value);
    this.preferencesService.fontSize = target.value;
  }

  async deleteAccount() {
    const response: BackendResponse = await this.authService.deleteAccount();
    console.log(response)

    if (response.error) this.errorMessage.next(response.message)
    else this.router.navigate(['/auth', 'register']);
  }
}
