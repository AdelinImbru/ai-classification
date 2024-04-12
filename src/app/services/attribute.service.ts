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
  api = url + 'attribute';
  attribute!: IAttribute[];
  constructor(private http: HttpClient) {}
  getAttribute() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.attribute = data as IAttribute[]));
    return this.attribute;
  }

  addAttribute(attribute: IAttribute) {
    this.http.post(this.api + '/', attribute);
  }

  updateAttribute(id: number, attribute: IAttribute) {
    this.http.patch(this.api + '/', attribute);
  }

  deleteAttribute(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
