import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate(): boolean {
    if (localStorage.getItem('token') && this.userService.is_token_valid) {
      // this.router.navigate([route.url[0].path])
      return true
  }
    this.router.navigate(['auth'])
    return false
  };
  }