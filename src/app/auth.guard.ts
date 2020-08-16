import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.loading) {
      await (async () => {
        while (this.authService.loading) {
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
      })();
    }

    if (this.authService.user.id) {
      return true;
    } else {
      return false;
    }
  }
}
