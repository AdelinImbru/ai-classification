import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  user!: IUser;
  constructor(private router: Router, private userService: UserService) {}
  ngOnInit(): void {
    let user = localStorage.getItem('loggedUser');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  logout() {
    this.userService.blackListToken();
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  login() {
    this.router.navigate(['/auth']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
