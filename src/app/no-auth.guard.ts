import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.loading) {
      await (async () => {
        while (this.authService.loading) {
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
      })();
    }

    if (this.authService.user.id) return this.router.parseUrl('/app');
    else return true;
  }
}
