import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

export interface IAttribute {
  name: string;
  description: string;
  type: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  api = url.apiKey + 'attribute';
  attribute!: IAttribute[];
  constructor(private http: HttpClient) {}
  getAttribute() {
    return this.http.get(this.api);
  }

  getAttributeById(id: number) {
    return this.http.get(this.api + '/' + id.toString());
  }

  addAttribute(attribute: IAttribute) {
    return this.http.post(this.api + '/', attribute);
  }

  updateAttribute(id: number, attribute: IAttribute) {
    return this.http.patch(this.api + '/' + id.toString(), attribute);
  }

  deleteAttribute(id: number) {
    return this.http.delete(this.api + '/' + id.toString() + '/');
  }
}
