import { Injectable } from '@angular/core';
import { url } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IAttribute } from '../services/attribute.service';
import { BehaviorSubject } from 'rxjs';

export interface IMappingTemplate {
  id: string;
  name: string;
  description: string;
  attributes: string[];
  field_of_activity: string;
  user: number;
}

@Injectable({
  providedIn: 'root',
})
export class MappingTemplateService {
  api = url.apiKey + 'mapping-template';
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  private templates = new BehaviorSubject<IMappingTemplate[]>([])
  $templates = this.templates.asObservable()
  constructor(private http: HttpClient) {}
  getMappingTemplate() {
    return this.http.get(this.api, { headers: this.headers })
  }

  addMappingTemplate(mappingTemplate:IMappingTemplate) {
    return this.http.post(this.api + 's/', mappingTemplate, { headers: this.headers });
  }

  setMappingTemplates(mapping_templates: IMappingTemplate[]){
    this.templates.next(mapping_templates)
  }

  updateMappingTemplate(id: number, mappingTemplate: IMappingTemplate) {
    return this.http.patch(this.api + '/' + id.toString(), mappingTemplate);
  }

  deleteMappingTemplate(id: string) {
    return this.http.delete(url.apiKey + 'delete-template/', {body: {'id':id}, headers: this.headers});
  }
}
