import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateAttributeModalComponent } from 'src/app/create-attribute-modal/create-attribute-modal.component';
import {
  AttributeService,
  IAttribute,
} from 'src/app/services/attribute.service';
import { IMappingTemplate, MappingTemplateService } from 'src/app/services/mapping-template.service';
import { IMappingSetup, IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mapping-setup',
  templateUrl: './mapping-setup.component.html',
  styleUrls: ['./mapping-setup.component.scss'],
})
export class MappingSetupComponent {
  errorMessage: any = [];
  keys: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private attributeService: AttributeService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private mappingTemplateService: MappingTemplateService
  ) {}
  mappingSetupForm!: FormGroup;
  mappingSetupFormValid = true;
  attributes!: IAttribute[];
  loggedUser!: IUser;
  templates!: IMappingTemplate[];
  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.loggedUser=data as IUser)
    if(!this.loggedUser){
      let user = localStorage.getItem('loggedUser')
      if(this.userService.verifyToken() && user){
        this.loggedUser=JSON.parse(user) as IUser
      }
    }
    this.mappingSetupForm = this.formBuilder.group({
      user: [this.loggedUser.id],
      field_of_activity: ['', Validators.required],
      mapping_template: [''],
      attributes: [[]],
      number_of_attribute_values: [0],
      use_descriptions: [false, Validators.required],
      number_of_memory_values: [0],
      use_check_prompt: [false, Validators.required],
    });
    this.mappingSetupForm.markAllAsTouched();
    let token = localStorage.getItem('token');
    if (token) {
      this.attributeService
        .getAttributes()
        .subscribe((data) => (this.attributes = data as IAttribute[]));
      this.mappingTemplateService.getMappingTemplate().subscribe(data=>this.templates=data as IMappingTemplate[])
    }
  }

  onSubmit() {
    this.userService.setMappingSetup(this.mappingSetupForm.value as IMappingSetup).subscribe({ next: (data) => console.log(data),
      error: (error) => {
        this.errorMessage.push(error.error);
        this.keys = this.keys.concat(Object.keys(this.errorMessage));
      },
    })
    if (this.errorMessage) {
      for (let key of this.keys) {
        this._snackBar.open(this.errorMessage[key], 'Error', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    } 
    else {
      this.router.navigate(['classification']);
    }
  }

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
