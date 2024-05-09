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

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  errorMessage: any;
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
    private userService: UserService
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
        },
        error: (error) => {
          this.errorMessage = error.error;
          this.keys = Object.keys(this.errorMessage);
        },
      });
    }
    if(this.errorMessage){
      this.formValid = false; 
    }
     else {
      this.router.navigate(['/home'])
         }
  }
  

   onRegister() {
    if (this.registerForm.valid) {
      this.userService
        .register(this.registerForm.value as IRegister)
        .subscribe({
          error: (error) => {
            this.errorMessage = error.error;
            this.keys = Object.keys(this.errorMessage);
          },
        });
      if (!this.errorMessage) {
        this.userService
          .login({
            username: this.registerForm.value['username'],
            password: this.registerForm.value['password'],
          })
          .subscribe({
            next: (data) => {
              this.token = data.access;
            },
            error: (error) => {
              this.errorMessage.append(error.error);
              this.keys = Object.keys(this.errorMessage);
            },
          });
      }
    }
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.router.navigate(['/home']);
    } else {
      this.formValid = false;
    }
  }

  switchForm() {
    this.switch = !this.switch;
    this.errorMessage = null;
  }
}
