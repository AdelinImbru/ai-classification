import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributeService, IAttribute } from '../services/attribute.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser, UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-attribute-modal',
  templateUrl: './create-attribute-modal.component.html',
  styleUrls: ['./create-attribute-modal.component.scss'],
})
export class CreateAttributeModalComponent {
  constructor(
    private formBuilder: FormBuilder,
    private attributeService: AttributeService,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  createAttributeForm!: FormGroup;
  @Output() new_attribute = new EventEmitter<IAttribute>(); 
  attributes!: IAttribute[]
  errorMessage: any;
  keys!: string[];
  user!: IUser;

  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.user=data as IUser);
    if(!this.user){
      let usr = localStorage.getItem('loggedUser')
      if(this.userService.is_token_valid && usr){
        this.user=JSON.parse(usr) as IUser
      }
    }
    this.createAttributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [''],
      user: this.user.id,
    });
  }
  createAttribute() {
    this.attributeService
      .addAttribute(this.createAttributeForm.value as IAttribute)
      .subscribe({
        next: (data) => {
          this.attributes = data as IAttribute[];
          this.attributeService.setAttributes(this.attributes)
        },
        error: (error) => {
          this.errorMessage = error.status + ' ' + error.statusText;
          this.keys = Object.keys(this.errorMessage);
        },
      });
    if (this.errorMessage) {
      for (let key of this.keys) {
        this._snackBar.open(this.errorMessage[key], 'Error', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    } else {
      this._snackBar.open('Attribute created succesfully', 'Success', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
}
