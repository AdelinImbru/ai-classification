import { Component, OnInit } from '@angular/core';
import { IUser, UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: IUser;
  profileForm!: FormGroup;
  editable_var: boolean = true;
  errorMessage: any;
  keys!: string[];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.userService.user.subscribe(data=>this.user=data as IUser);
    if(!this.user){
      let usr = localStorage.getItem('loggedUser')
      if(this.userService.verifyToken() && usr){
        this.user=JSON.parse(usr) as IUser
      }
    }
    this.profileForm = this.formBuilder.group({
      username: new FormControl({
        value: this.user.username || '',
        disabled: true,
      }),
      first_name: new FormControl(this.user.first_name || ''),
      last_name: new FormControl(this.user.last_name || ''),
      email: new FormControl(this.user.email || ''),
      groups: new FormControl({
        value: this.user.groups || [],
        disabled: true,
      }),
      user_permissions: new FormControl({
        value: this.user.user_permissions || [],
        disabled: true,
      }),
    });
    this.editable();
  }

  editable() {
    this.editable_var = !this.editable_var;
    if (this.editable_var) {
      this.profileForm.controls['first_name']?.enable();
      this.profileForm.controls['last_name']?.enable();
      this.profileForm.controls['email']?.enable();
    } else {
      this.profileForm.controls['first_name']?.disable();
      this.profileForm.controls['last_name']?.disable();
      this.profileForm.controls['email']?.disable();
    }
  }

  save() {
    let token = localStorage.getItem('token');
    if (token) {
      this.userService
        .updateUser(this.profileForm.value as IUser, token)
        .subscribe({
          next: (data) => {
            this.user = data as IUser;
          },
          error: (error) => {
            this.errorMessage = error.error;
            this.keys = Object.keys(this.errorMessage);
          },
        });
    }
  }
}
