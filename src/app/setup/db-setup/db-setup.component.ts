import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import {
  AttributeFileService,
  IAttributeFile,
  Type,
} from 'src/app/services/attribute-file.service';
import {
  IMemoryFile,
  MemoryFileService,
} from 'src/app/services/memory-file.service';
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
    private attributeFileService: AttributeFileService,
    private memoryFileService: MemoryFileService,
    public _snackBar: MatSnackBar,
    private userService: UserService
  ) {}
  dbSetupForm!: FormGroup;
  dbSetupFormValid = true;
  loggedUser!: IUser;
  attributeFile!: File;
  attributeValuesFile!: File;
  memoryFile!: File; 
  filesToUpload: File[] = [];

  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.loggedUser=data as IUser)
    if(!this.loggedUser){
      let user = localStorage.getItem('loggedUser')
      if(this.userService.verifyToken() && user){
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
        // this.dbSetupForm.patchValue({attributesFile: event.target.files[0].name})
      }
      if(name==='value'){
        this.attributeValuesFile=event.target.files[0]
        // this.dbSetupForm.patchValue({attributeValuesFile: event.target.files[0].name})
      }
      if(name==='memory'){
        this.memoryFile=event.target.files[0]
        // this.dbSetupForm.patchValue({memoryFile: event.target.files[0].name})
      }
    }
    else{
      return
    }
  }

  async addAttributeFile(){
    let attrFormData = new FormData();
    attrFormData.append('name', this.attributeFile.name);
    attrFormData.append('type', Type.attributes);
    attrFormData.append('user', this.loggedUser.id.toString());
    attrFormData.append('sample_file', this.attributeFile, this.attributeFile.name);
    await this.attributeFileService.addAttributeFile(attrFormData).subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        this.errorMessage.push(error.error);
        this.keys = this.keys.concat(Object.keys(this.errorMessage));
      }, 
  })
}

async addAttributeValuesFile(){
  let valFormData = new FormData();
  valFormData.append('name', this.attributeValuesFile.name);
  valFormData.append('type', Type.values);
  valFormData.append('user', this.loggedUser.id.toString());
  valFormData.append('sample_file',  this.attributeValuesFile, this.attributeValuesFile.name);
  await this.attributeFileService
    .addAttributeFile(valFormData)
    .subscribe({
      error: (error) => {
        this.errorMessage.push(error.error);
        this.keys = this.keys.concat(Object.keys(this.errorMessage));
      },
    });
}

async addMemoryFile(){
  let field_of_activity=this.dbSetupForm.value['domain']
  let memoryFormData = new FormData();
  memoryFormData.append('name', this.memoryFile.name);
  memoryFormData.append('memory_file', this.memoryFile, this.memoryFile.name);
  memoryFormData.append('user', this.loggedUser.id.toString());
  memoryFormData.append('field_of_activity', field_of_activity);
  await this.memoryFileService
    .addMemoryFile(memoryFormData)
    .subscribe({
      error: (error) => {
        this.errorMessage.push(error.error);
        this.keys = this.keys.concat(Object.keys(this.errorMessage));
      },
    });
}

  onSubmit() {
    //TODO Solve database locked problem when doing the 3 requests.
      setTimeout(()=>{this.addAttributeFile()}, 2000)
      setTimeout(()=>{
      if (
        this.dbSetupForm.value['useMemory'] &&
        this.dbSetupForm.value['memoryFile']
      ) {
        this.addMemoryFile()
      }
    }, 2000)
    setTimeout(()=>{
      if (this.dbSetupForm.value['useAttributeValues'] && this.dbSetupForm.value['attributeValuesFile']){
        this.addAttributeValuesFile()
      }
    }, 2000)
      if (this.errorMessage) {
        for (let key of this.keys) {
          this._snackBar.open(this.errorMessage[key], 'Error', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      } 
      else {
        this.router.navigate(['mappingsetup']);
      }
  }
}
