import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateAttributeModalComponent } from 'src/app/create-attribute-modal/create-attribute-modal.component';
import { CreateMappingTemplateModalComponent } from 'src/app/create-mapping-template-modal/create-mapping-template-modal.component';
import {
  AttributeService,
  IAttribute,
} from 'src/app/services/attribute.service';
import { IMappingTemplate, MappingTemplateService } from 'src/app/services/mapping-template.service';
import { IMappingSetup, IUser, UserService } from 'src/app/services/user.service';

interface IDbSetup{
  "use_attribute_values": boolean,
  "use_memory": boolean
}

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
  dbSetup!: IDbSetup;
  attributes!: IAttribute[];
  $attributes!: Observable<IAttribute[]>;
  loggedUser!: IUser;
  templates!: IMappingTemplate[];
  $templates!: Observable<IMappingTemplate[]>
  foc!: string;
  use_template: boolean = false
  ngOnInit(): void {
    this.userService.user.subscribe(data=>this.loggedUser=data as IUser)
    this.userService.getDbSetup().subscribe(data=>this.dbSetup=data as IDbSetup)
    if(!this.loggedUser){
      let user = localStorage.getItem('loggedUser')
      if(this.userService.is_token_valid && user){
        this.loggedUser=JSON.parse(user) as IUser
      }
    }
    this.mappingSetupForm = this.formBuilder.group({
      user: [this.loggedUser.id],
      field_of_activity: ['', Validators.required],
      mapping_template: [null],
      attributes: [[]],
      number_of_attribute_values: [0],
      use_descriptions: [false, Validators.required],
      number_of_memory_values: [0],
      use_check_prompt: [false, Validators.required],
    });
    let token = localStorage.getItem('token');
    if (token) {
      this.$attributes=this.attributeService.$attributes
      this.$templates=this.mappingTemplateService.$templates
      this.attributeService
        .getAttributes()
        .subscribe((data) => {this.attributes = data;        
          this.attributeService.setAttributes(this.attributes)
        });
      this.mappingTemplateService.getMappingTemplate().subscribe(data=>{this.templates=data as IMappingTemplate[]; this.mappingTemplateService.setMappingTemplates(this.templates)})
    }
  }

  onSubmit() {
    if(!this.use_template){this.mappingSetupForm.removeControl('mapping_template')}
    let mappingSetup=this.mappingSetupForm.value as IMappingSetup
    if(this.use_template)
      {this.mappingSetupForm.value['field_of_activity']=this.foc
      mappingSetup.mapping_template=mappingSetup.mapping_template.id}
    this.userService.setMappingSetup(mappingSetup).subscribe({
      error: (error) => {
        this.errorMessage.push(error.status + ' ' + error.statusText);
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
    this.router.navigate(['classification'])
  }

  openDialog(dialog: string) {
    if(dialog==='attribute'){
    this.dialog.open(CreateAttributeModalComponent, {
      width: '30%',
      height: '60%',
      minWidth: '15rem',
      position: { left: '50px' },
      backdropClass: 'custom-dialog-overlay',
      disableClose: false,
      restoreFocus: true,
    });
  }
    if(dialog==='template'){
      this.dialog.open(CreateMappingTemplateModalComponent, {
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

  useTemplate(){
    this.use_template = !this.use_template;
    (document.getElementById('field_of_activity') as HTMLInputElement).disabled=this.use_template
  }

  onChange(){
      let template=this.mappingSetupForm.value['mapping_template'] as IMappingSetup
      (document.getElementById('field_of_activity') as HTMLInputElement).value=template.field_of_activity
      this.foc=template.field_of_activity
    this.mappingSetupForm.controls['field_of_activity'].markAsDirty
  }

  deleteTemplate(id: string){
    if(confirm("Are you sure you want to delete this classification?")) {
      this.mappingTemplateService.deleteMappingTemplate(id).subscribe({next: data=>{this.templates=data as IMappingTemplate[]; this.mappingTemplateService.setMappingTemplates(this.templates)},
      error: (error) => {this._snackBar.open('Deleting failed, please check if you are not using the value first.', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });}
    })
    }
  }

  deleteAttribute(id: string){
    if(confirm("Are you sure you want to delete this classification?")) {
    this.attributeService.deleteAttribute(id).subscribe({next: data=>{this.attributes=data as IAttribute[]; this.attributeService.setAttributes(this.attributes)},
  error: (error) => {this._snackBar.open('Deleting failed, please check if you are not using the value first.', 'Error', {
    horizontalPosition: 'end',
    verticalPosition: 'top',
  });}
})
    }
}
}
