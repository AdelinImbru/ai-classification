import { Injectable } from '@angular/core';
import { url } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IAttribute } from '../services/attribute.service';

export interface IMappingTemplate {
  id: string;
  name: string;
  description: string;
  field_of_activity: string;
  user: number;
}

@Injectable({
  providedIn: 'root',
})
export class MappingTemplateService {
  api = url.apiKey + 'mapping-template';
  mappingTemplate!: IMappingTemplate[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getMappingTemplate() {
    return this.http.get(this.api, { headers: this.headers })
  }

  addMappingTemplate(mappingTemplate:any) {
    return this.http.post(this.api + '/', mappingTemplate, { headers: this.headers });
  }

  updateMappingTemplate(id: number, mappingTemplate: IMappingTemplate) {
    return this.http.patch(this.api + '/' + id.toString(), mappingTemplate);
  }

  deleteMappingTemplate(id: number) {
    return this.http.delete(this.api + '/' + id.toString());
  }
}
