import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';
import { BehaviorSubject, map } from 'rxjs';

export interface IAttribute {
  id: string;
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
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  private attributes = new BehaviorSubject<IAttribute[]>([])
  $attributes = this.attributes.asObservable()
  constructor(private http: HttpClient) {}
  getAttributes() {
    return this.http.get<IAttribute[]>(this.api + 's', { headers: this.headers });
  }

  getAttributeById(id: number) {
    return this.http.get(this.api + '/' + id.toString());
  }

  addAttribute(attribute: IAttribute) {
    return this.http.post<IAttribute[]>(this.api + 's/', attribute, { headers: this.headers });
  }

  setAttributes(attributes: IAttribute[]){
      this.attributes.next(attributes);
  }

  updateAttribute(id: number, attribute: IAttribute) {
    return this.http.patch(this.api + '/' + id.toString(), attribute);
  }

  deleteAttribute(id: string) {
    return this.http.delete(url.apiKey + 'delete-attribute/', {body: {'id':id}, headers: this.headers});
  }
}
