import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeModalComponent } from 'src/app/create-attribute-modal/create-attribute-modal.component';

@Component({
  selector: 'app-mapping-setup',
  templateUrl: './mapping-setup.component.html',
  styleUrls: ['./mapping-setup.component.scss'],
})
export class MappingSetupComponent {
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}
  mappingSetupForm!: FormGroup;
  mappingSetupFormValid = true;
  attributes = [
    { name: 1, id: 1 },
    { name: 2, id: 2 },
    { name: 3, id: 3 },
  ];
  ngOnInit(): void {
    this.mappingSetupForm = this.formBuilder.group({
      domain: ['', Validators.required],
      mappingTemplate: ['', Validators.required],
      attributes: [[], Validators.required],
      numberOfAttributeValuesRetrieved: [0],
      useDescriptions: [false, Validators.required],
      numberOfMemoryValuesRetrieved: [0],
      useCheckPrompt: [false, Validators.required],
    });
    this.mappingSetupForm.markAllAsTouched();
  }
  onSubmit() {}

  openDialog() {
    this.dialog.open(CreateAttributeModalComponent, {
      width: '30%',
      height: '60%',
      minWidth: '15rem',
      position: { left: '50px' },
      backdropClass: 'custom-dialog-overlay',
      disableClose: true,
      restoreFocus: true,
    });
  }
}
