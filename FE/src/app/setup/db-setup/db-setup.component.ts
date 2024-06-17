import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-db-setup',
  templateUrl: './db-setup.component.html',
  styleUrls: ['./db-setup.component.scss'],
})
export class DbSetupComponent {
  errorMessage: any = [];
  keys: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    private userService: UserService
  ) {}
  dbSetupForm!: FormGroup;
  dbSetupFormValid = true;
  loggedUser!: IUser;
  attributeFile!: File;
  attributeValuesFile!: File;
  memoryFile!: File; 
  filesToUpload:any = [];

  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.loggedUser=data as IUser)
    if(!this.loggedUser){
      let user = localStorage.getItem('loggedUser')
      if(this.userService.is_token_valid && user){
        this.loggedUser=JSON.parse(user) as IUser
      }
    }
    this.dbSetupForm = this.formBuilder.group({
      attributesFile: ['', Validators.required],
      useAttributeValues: [false, Validators.required],
      attributeValuesFile: ['', Validators.required],
      useMemory: [false, Validators.required],
      memoryFile: ['', Validators.required],
      domain: ['', Validators.required],
    });
     this.dbSetupForm.markAllAsTouched();
  }

  openDialog() {
    this.dialog.open(InfoDialogComponent, {
      width: '30%',
      height: '80%',
      minWidth: '15rem',
      position: { left: '50px' },
      backdropClass: 'custom-dialog-overlay',
      disableClose: true,
      restoreFocus: true,
    });
  }

  handleFileInput(event: any, name: string) {
    if (event.target.files.length > 0) {
      if(name==='attribute'){
        this.attributeFile=event.target.files[0]
        this.filesToUpload.push({'file': event.target.files[0], 'type': 'attribute_file'})
       }
      if(name==='value'){
        this.attributeValuesFile=event.target.files[0]
        this.filesToUpload.push({'file': event.target.files[0], 'type': 'attribute_values_file'})
      }
      if(name==='memory'){
        this.memoryFile=event.target.files[0]
        this.filesToUpload.push({'file': event.target.files[0], 'type': 'memory_file'})
      }
    }
    else{
      return
    }
  }

  onSubmit() {
    if(this.filesToUpload.length > 0){
    let field_of_activity=this.dbSetupForm.value['domain']
    let filesForm = new FormData()
    for(let f of this.filesToUpload){
      filesForm.append(f.type, f.file)
    }
      filesForm.append('field_of_activity', field_of_activity)
      filesForm.append('use_attribute_values', this.dbSetupForm.value['useAttributeValues'])
      filesForm.append('use_memory', this.dbSetupForm.value['useMemory'])
      filesForm.append('user', this.loggedUser.id.toString());
      this.userService.dbSetup(filesForm).subscribe((error)=>this._snackBar.open('Please check if all the fields are completed correctly.', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'top',}))
    }
  this.router.navigate(['mappingsetup'])
}
}