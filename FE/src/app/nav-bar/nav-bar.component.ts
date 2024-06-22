import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, UserService } from '../services/user.service';
import { Observable, interval, mergeMap } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  user!: IUser;
  mobileQuery!: MediaQueryList;

  private _mobileQueryListener: () => void;
  constructor(private router: Router, private userService: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    interval(5 * 60 * 1000)
    .pipe(
        mergeMap(() => this.userService.verifyToken())).subscribe({
          next:(data) => this.userService.is_token_valid = true,
          error: () => {
            this.logout()
          }
        })
        this.mobileQuery = media.matchMedia('(max-width: 800px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.user=data as IUser)
    if(!this.user){
      let usr = localStorage.getItem('loggedUser')
      if(usr && this.userService.is_token_valid){
      this.user=JSON.parse(usr) as IUser
    }
  }
}

ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
}

  logout() {
    this.userService.logout().subscribe(data=>console.log(data))
    this.router.navigate(['/auth']);
  }

  login() {
    this.router.navigate(['/auth']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
