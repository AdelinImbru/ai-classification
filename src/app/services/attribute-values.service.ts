import { Injectable } from '@angular/core';
import { IAttribute } from './attribute.service';
import { url } from '../environment';
import { HttpClient } from '@angular/common/http';

export interface IAttributeValues {
  name: string;
  description: string;
  attribute: IAttribute;
  user_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeValuesService {
  api = url + 'attribute-value';
  attributeValues!: IAttributeValues[];
  constructor(private http: HttpClient) {}
  getAttribute() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.attributeValues = data as IAttributeValues[]));
    return this.attributeValues;
  }

  addAttribute(attributeValues: IAttributeValues) {
    this.http.post(this.api + '/', attributeValues);
  }

  updateAttribute(id: number, attributeValues: IAttributeValues) {
    this.http.patch(this.api + '/', attributeValues);
  }

  deleteAttribute(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
