import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeModalComponent } from 'src/app/create-attribute-modal/create-attribute-modal.component';
import {
  AttributeService,
  IAttribute,
} from 'src/app/services/attribute.service';

@Component({
  selector: 'app-mapping-setup',
  templateUrl: './mapping-setup.component.html',
  styleUrls: ['./mapping-setup.component.scss'],
})
export class MappingSetupComponent {
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private attributeService: AttributeService
  ) {}
  mappingSetupForm!: FormGroup;
  mappingSetupFormValid = true;
  attributes!: IAttribute[];
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
    let token = localStorage.getItem('token');
    if (token) {
      this.attributeService
        .getAttributes()
        .subscribe((data) => (this.attributes = data as IAttribute[]));
    }
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
