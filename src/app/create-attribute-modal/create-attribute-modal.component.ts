import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributeService, IAttribute } from '../services/attribute.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-attribute-modal',
  templateUrl: './create-attribute-modal.component.html',
  styleUrls: ['./create-attribute-modal.component.scss'],
})
export class CreateAttributeModalComponent {
  constructor(
    private formBuilder: FormBuilder,
    private attributeService: AttributeService,
    private _snackBar: MatSnackBar
  ) {}

  createAttributeForm!: FormGroup;
  attribute!: IAttribute;
  errorMessage: any;
  keys!: string[];

  ngOnInit(): void {
    this.createAttributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [''],
    });
  }
  createAttribute() {
    this.attributeService
      .addAttribute(this.createAttributeForm.value as IAttribute)
      .subscribe({
        next: (data) => {
          this.attribute = data as IAttribute;
        },
        error: (error) => {
          this.errorMessage = error.error;
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
