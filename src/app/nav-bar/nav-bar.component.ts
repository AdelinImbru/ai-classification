import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  user: any;
  constructor(private router: Router) {}
  ngOnInit(): void {
    //Get logged user
  }

  logout() {
    //logout function
  }

  create() {
    //go to create user page / open form.
  }
}
