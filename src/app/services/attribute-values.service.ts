import { Injectable } from '@angular/core';
import { IAttribute } from './attribute.service';
import { url } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  api = url.apiKey + 'attribute-value';
  attributeValues!: IAttributeValues[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getAttributeValues() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.attributeValues = data as IAttributeValues[]));
    return this.attributeValues;
  }

  addAttributeValues(attributeValues: IAttributeValues) {
    return this.http.post(this.api + '/', attributeValues, { headers: this.headers });
  }

  updateAttributeValues(id: number, attributeValues: IAttributeValues) {
    return this.http.patch(this.api + '/' + id.toString(), attributeValues);
  }

  deleteAttributeValues(id: number) {
    return this.http.delete(this.api + '/' + id.toString());
  }
}
