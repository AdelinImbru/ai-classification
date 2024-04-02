import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';

@Component({
  selector: 'app-db-setup',
  templateUrl: './db-setup.component.html',
  styleUrls: ['./db-setup.component.scss'],
})
export class DbSetupComponent {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {}
  dbSetupForm!: FormGroup;
  dbSetupFormValid = true;
  ngOnInit(): void {
    this.dbSetupForm = this.formBuilder.group({
      attributesFile: ['', Validators.required],
      useAttributeValues: [false, Validators.required],
      attributeValuesFile: ['', Validators.required],
      useMemory: [false, Validators.required],
      memoryFile: ['', Validators.required],
    });
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

  onSubmit() {
    //todo add to db the files and file contents
    this.router.navigate(['mappingsetup']);
  }
}
