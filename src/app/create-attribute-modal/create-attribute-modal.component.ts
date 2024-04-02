import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-attribute-modal',
  templateUrl: './create-attribute-modal.component.html',
  styleUrls: ['./create-attribute-modal.component.scss'],
})
export class CreateAttributeModalComponent {
  constructor(private formBuilder: FormBuilder) {}

  createAttributeForm!: FormGroup;
  ngOnInit(): void {
    this.createAttributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [''],
    });
  }
  createAttribute() {}
}
