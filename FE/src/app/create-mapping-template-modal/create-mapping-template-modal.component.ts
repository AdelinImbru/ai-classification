import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMappingTemplate, MappingTemplateService } from '../services/mapping-template.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser, UserService } from '../services/user.service';
import { AttributeService, IAttribute } from '../services/attribute.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-mapping-template-modal',
  templateUrl: './create-mapping-template-modal.component.html',
  styleUrls: ['./create-mapping-template-modal.component.scss']
})
export class CreateMappingTemplateModalComponent {
  constructor(
    private formBuilder: FormBuilder,
    private mappingTemplateService: MappingTemplateService,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private attributeService: AttributeService
  ) {}

  createTemplateForm!: FormGroup;
  mappingTemplates!: IMappingTemplate[];
  errorMessage: any;
  keys!: string[];
  user!: IUser;
  attributes!: IAttribute[];
  $attributes!: Observable<IAttribute[]>

  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.user=data as IUser);
    this.$attributes=this.attributeService.$attributes
    if(!this.user){
      let usr = localStorage.getItem('loggedUser')
      if(this.userService.is_token_valid && usr){
        this.user=JSON.parse(usr) as IUser
          this.attributeService
            .getAttributes()
            .subscribe((data) => {this.attributes = data; this.attributeService.setAttributes(data)});
        }
      }
    this.createTemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      field_of_activity: ['', Validators.required],
      attributes: [[], Validators.required],
      user: this.user.id,
    });
  }
  createMappingTemplate() {
    this.mappingTemplateService
      .addMappingTemplate(this.createTemplateForm.value as IMappingTemplate)
      .subscribe({
        next: (data) => {
          this.mappingTemplates = data as IMappingTemplate[];
          this.mappingTemplateService.setMappingTemplates(this.mappingTemplates)    
        },
        error: (error) => {
          this.errorMessage = error.status + ' ' + error;
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
      this._snackBar.open('Mapping template created succesfully', 'Success', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
}
