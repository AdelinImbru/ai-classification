import { Injectable } from '@angular/core';
import { url } from '../environment';
import { HttpClient } from '@angular/common/http';
import { IAttribute } from '../services/attribute.service';

export interface IMappingTemplate {
  name: string;
  description: string;
  field_of_activity: string;
  user_id: number;
  attributes: IAttribute[];
}

@Injectable({
  providedIn: 'root',
})
export class MappingTemplateService {
  api = url + 'mapping-template';
  mappingTemplate!: IMappingTemplate[];
  constructor(private http: HttpClient) {}
  getMappingTemplate() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.mappingTemplate = data as IMappingTemplate[]));
    return this.mappingTemplate;
  }

  addMappingTemplate(mappingTemplate: IMappingTemplate) {
    this.http.post(this.api + '/', mappingTemplate);
  }

  updateMappingTemplate(id: number, mappingTemplate: IMappingTemplate) {
    this.http.patch(this.api + '/' + id.toString(), mappingTemplate);
  }

  deleteMappingTemplate(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
