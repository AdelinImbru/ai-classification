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
import { IUser } from 'src/app/services/user.service';

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
    public _snackBar: MatSnackBar
  ) {}
  dbSetupForm!: FormGroup;
  dbSetupFormValid = true;
  loggedUser!: IUser;
  filesToUpload: File[] = [];

  ngOnInit(): void {
    this.dbSetupForm = this.formBuilder.group({
      attributesFile: ['', Validators.required],
      useAttributeValues: [false, Validators.required],
      attributeValuesFile: ['', Validators.required],
      useMemory: [false, Validators.required],
      memoryFile: ['', Validators.required],
      domain: ['', Validators.required],
    });
    let user = localStorage.getItem('loggedUser');
    if (user) {
      this.loggedUser = JSON.parse(user) as IUser;
    }
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

  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      this.filesToUpload.push(event.target.files[0]);
    }
  }

  onSubmit() {
    if (this.dbSetupForm.value['attributesFile']) {
      let name: string = '';
      if (this.filesToUpload[0]) {
        name = this.filesToUpload[0].name;
      }
      let formData = new FormData();
      formData.append('name', name);
      formData.append('type', Type.attributes);
      formData.append('user', this.loggedUser.id.toString());
      formData.append('sample_file', this.filesToUpload[0], name);
      this.attributeFileService.addAttributeFile(formData).subscribe({
        next: (data) => console.log(data),
        error: (error) => {
          this.errorMessage.push(error.error);
          this.keys = this.keys.concat(Object.keys(this.errorMessage));
        },
      });
    }
    //   if (
    //     this.dbSetupForm.value['useAttributeValues'] &&
    //     this.dbSetupForm.value['attributeValuesFile']
    //   ) {
    //     let name: string = '';
    //     if (this.filesToUpload[1]) {
    //       name = this.filesToUpload[1].name;
    //     }
    //     this.attributeFileService
    //       .addAttributeFile({
    //         name: name,
    //         type: Type.values,
    //         user: this.loggedUser.id,
    //         sample_file: this.filesToUpload[1],
    //       } as IAttributeFile)
    //       .subscribe({
    //         error: (error) => {
    //           this.errorMessage.push(error.error);
    //           this.keys = this.keys.concat(Object.keys(this.errorMessage));
    //         },
    //       });
    //   }
    //   if (
    //     this.dbSetupForm.value['useMemory'] &&
    //     this.dbSetupForm.value['memoryFile']
    //   ) {
    //     let name: string = '';
    //     if (this.filesToUpload[2]) {
    //       name = this.filesToUpload[2].name;
    //     }
    //     this.memoryFileService
    //       .addMemoryFile({
    //         name: name,
    //         user: this.loggedUser.id,
    //         field_of_activity: this.dbSetupForm.value['domain'],
    //         memory_file: this.filesToUpload[2],
    //       } as IMemoryFile)
    //       .subscribe({
    //         error: (error) => {
    //           this.errorMessage.push(error.error);
    //           this.keys = this.keys.concat(Object.keys(this.errorMessage));
    //         },
    //       });
    //   }
    //   if (this.errorMessage) {
    //     for (let key of this.keys) {
    //       this._snackBar.open(this.errorMessage[key], 'Error', {
    //         horizontalPosition: 'end',
    //         verticalPosition: 'top',
    //       });
    //     }
    //   } else {
    //     this.router.navigate(['mappingsetup']);
    //   }
  }
}
