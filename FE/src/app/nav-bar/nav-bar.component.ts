import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, UserService } from '../services/user.service';
import { Observable, interval, mergeMap } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  user!: IUser;
  constructor(private router: Router, private userService: UserService) {
    interval(5 * 60 * 1000)
    .pipe(
        mergeMap(() => this.userService.verifyToken())).subscribe({
          next:(data) => this.userService.is_token_valid = true,
          error: () => {
            this.logout()
          }
        })
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

  logout() {
    this.userService.logout()
    this.router.navigate(['/auth']);
  }

  login() {
    this.router.navigate(['/auth']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
