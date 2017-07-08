import {Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanLoad {

  canLoad(route: Route): Promise<boolean> {
    const role = this.authService.getRole();
    if (!route.path.startsWith(role)) {
      this.router.navigate(['/unauthorized']);
    }
    return Promise.resolve(true);
  }


  constructor(private authService: AuthService,
              private router: Router) { }

}
