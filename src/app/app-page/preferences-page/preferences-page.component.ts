import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { PreferencesService } from '../../shared/services/preferences.service';

@Component({
  selector: 'app-preferences-page',
  templateUrl: './preferences-page.component.html',
  styleUrls: ['./preferences-page.component.scss'],
})
export class PreferencesPageComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public preferencesService: PreferencesService
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
}
