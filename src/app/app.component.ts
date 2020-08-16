import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: Boolean = true;
  
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await (async () => {
      while(this.authService.loading) {
        await new Promise(resolve => setTimeout(resolve, 25))
      }
    })()

    this.loading = false;
  }
  
}
