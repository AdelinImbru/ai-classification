import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

export interface IAttribute {
  name: string;
  description: string;
  type: string;
  user: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  api = url.apiKey + 'attribute';
  attribute!: IAttribute[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getAttributes() {
    return this.http.get(this.api + 's', { headers: this.headers });
  }

  getAttributeById(id: number) {
    return this.http.get(this.api + '/' + id.toString());
  }

  addAttribute(attribute: IAttribute) {
    return this.http.post(this.api + 's/', attribute, { headers: this.headers });
  }

  updateAttribute(id: number, attribute: IAttribute) {
    return this.http.patch(this.api + '/' + id.toString(), attribute);
  }

  deleteAttribute(id: number) {
    return this.http.delete(this.api + '/' + id.toString() + '/');
  }
}
