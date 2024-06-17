import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ILogin,
  IRegister,
  IUser,
  UserService,
} from '../services/user.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  errorMessage: any = [];
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  formValid = true;
  loggedUser!: Observable<IUser | null>;
  token: string = '';
  user!: IUser;
  keys!: string[];
  hide = true;
  switch = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [localStorage.getItem('username') || '', Validators.required],
      password: ['', Validators.required],
    });
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
    this.loggedUser = this.userService.user
  }

  onSubmit() {
      if (this.loginForm.valid) {
       this.userService.login(this.loginForm.value as ILogin).subscribe({
        next: (data) => {
          this.token = data.access;
          this.userService.is_token_valid=true
          this.router.navigate(['home'])
        },
        error: (error) => {
          this.errorMessage = error.status + ' ' + error.statusText;
          this.keys = Object.keys(this.errorMessage);
          this.formValid = false; 
          this._snackBar.open('Please check if all the fields are completed correctly or contact us by going at the bottom on the homepage.', 'Error', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
        })
      }
      });
    }
  }
  

   onRegister() {
    if (this.registerForm.valid) {
      this.userService
        .register(this.registerForm.value as IRegister)
        .subscribe({
          error: (error) => {
            this.errorMessage = error.status + ' ' + error.statusText;
            this.keys = Object.keys(this.errorMessage);
          },
        });
      if (!this.errorMessage) {
        location.reload()
        this._snackBar.open('Account created succesfully', 'Success', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
      else{
        this._snackBar.open('Please check if all the fields are completed correctly.', 'Error', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    }
  }

  switchForm() {
    this.switch = !this.switch;
    this.errorMessage = null;
  }
}
