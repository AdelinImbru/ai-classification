import { Injectable } from '@angular/core';
import { url } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export enum Type {
  attributes = 'ATTRIBUTES',
  values = 'VALUES',
}

export interface IAttributeFile {
  name: string;
  type: Type;
  user: number;
  sample_file: File;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeFileService {
  api = url.apiKey + 'attribute-file';
  attributeFile!: IAttributeFile[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getAttributeFile() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.attributeFile = data as IAttributeFile[]));
    return this.attributeFile;
  }

  addAttributeFile(attributeFile: FormData) {
    return this.http.post(this.api + 's/', attributeFile, {
      headers: this.headers,
    });
  }

  updateAttributeFile(id: number, attributeFile: IAttributeFile) {
    return this.http.patch(this.api + '/' + id.toString(), attributeFile);
  }

  deleteAttributeFile(id: number) {
    return this.http.delete(this.api + '/' + id.toString());
  }
}
