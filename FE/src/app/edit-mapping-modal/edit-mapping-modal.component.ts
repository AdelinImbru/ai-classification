import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMappingSetup, IUser, UserService } from '../services/user.service';
import { AttributeValuesService, IAttributeValues } from '../services/attribute-values.service';
import { IMemory, MemoryService } from '../services/memory.service';

@Component({
  selector: 'app-edit-mapping-modal',
  templateUrl: './edit-mapping-modal.component.html',
  styleUrls: ['./edit-mapping-modal.component.scss']
})
export class EditMappingModalComponent{
  @Input() mappings!: any 
  editMappingsForm: FormGroup = new FormGroup({});
  mappingSetup: any;
  errorMessage: any;
  result: any;
  keys!: string[];
  value!: IAttributeValues[]
  index=0;
  valueIndex!: number;
  values = new Map<string, Array<IAttributeValues>>;
  constructor(
  private userService: UserService, private attributeValuesService: AttributeValuesService, private memoryService: MemoryService){}
  ngOnInit(): void {
    this.userService.getMappingSetup().subscribe({
      next: (data) => {
      this.mappingSetup=data 
      this.getAttributeValues(data)
    },
    error: (error) => {
      this.errorMessage.push(error.status + ' ' + error.statusText);
      this.keys = Object.keys(this.errorMessage);
    }
  })
 }

getAttributeValues(mappingSetup: any){
  for(let attr of mappingSetup.attributes){
    this.attributeValuesService.getAttributeValues(attr.id).subscribe((data)=>{this.values.set(attr.name, data as IAttributeValues[])})
  }
}

newFormControl(field: string): FormControl {
  return this.editMappingsForm.registerControl(field, new FormControl()) as FormControl;
}

previous(){
   if(this.index>0){
    this.index-=1
    this.result = new Map(Object.entries(this.mappings[this.index]))
  }
  return
}

next(){
  if(this.index<this.mappings.length){
    this.index+=1
    this.result = new Map(Object.entries(this.mappings[this.index]))
  }
  return 
}

exit(){
  this.mappings=[]
  this.result=[]
  this.index=0
  window.location.reload()
}

save(){
  this.errorMessage=[]
  this.keys=[]
  this.result = new Map(Object.entries(this.mappings[this.index]))
  let loggedUser=localStorage.getItem('loggedUser')
  let user: IUser
  let memory: IMemory
  let formValues = new Map(Object.entries(this.editMappingsForm.value))
  for(let attr of this.mappingSetup.attributes){
    if(formValues.get(attr.name)){
      this.result.set(attr.name, formValues.get(attr.name))
    }
    }
    if(loggedUser) {
    user=JSON.parse(loggedUser) 
    memory = {input: '', output: '', user: user.id, field_of_activity: this.mappingSetup.field_of_activity}
    memory.input=this.result.get('input')
    this.result.delete('input')
    this.result.delete('messages')
    memory.output=JSON.stringify(Object.fromEntries(this.result.entries()))
    this.memoryService.addMemory(memory as IMemory).subscribe({
      next: (data) => {
        console.log(data)
    },
    error: (error) => {
      this.errorMessage.push(error.status + ' ' + error.statusText);
      this.keys = Object.keys(this.errorMessage);
    }
  })
    }
    if(this.index==this.mappings.length-1){
      this.index-=1
    }
    this.mappings.splice(this.index, 1)
    this.editMappingsForm.reset()
    if(this.mappings.length <= 1)
      window.location.reload()
}

}
