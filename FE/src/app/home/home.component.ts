import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IContact, UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IMessage{
  'message': string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  constructor(private userService: UserService, private snackBar: MatSnackBar) {}
  @ViewChild('firstName') firstName!:ElementRef;
  @ViewChild('lastName') lastName!:ElementRef;
  @ViewChild('email') email!:ElementRef;
  @ViewChild('phoneNumber') phoneNumber!:ElementRef;
  @ViewChild('message') message!:ElementRef;

  ngOnInit() {}

  submit(){
    let contact: IContact = {
    "first_name": this.firstName.nativeElement.value, 
    "last_name": this.lastName.nativeElement.value, 
    "email": this.email.nativeElement.value, 
    "phone": this.phoneNumber.nativeElement.value, 
    "message": this.message.nativeElement.value
  }
  if(contact.email && contact.first_name && contact.last_name && contact.message){
  this.userService.contactSupport(contact).subscribe(data=>{let res=data; this.snackBar.open(res.toString(), 'success', {horizontalPosition: 'end', verticalPosition: 'top'})})
  this.firstName.nativeElement.value=''
  this.lastName.nativeElement.value=''
  this.email.nativeElement.value=''
  this.phoneNumber.nativeElement.value=''
  this.message.nativeElement.value=''
  }
else{
  this.snackBar.open('Please make sure you completed all of the fields.', 'warning', {horizontalPosition: 'end', verticalPosition: 'top'})
}
  }
}
