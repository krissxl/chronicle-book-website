import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.loading) {
      await(async () => {
        while (this.authService.loading) {
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
      })();
    }

    if (this.authService.user.id) {
      return false;
    } else {
      return true;
    }
  }
}
