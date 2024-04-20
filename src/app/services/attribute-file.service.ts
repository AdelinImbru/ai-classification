import { Injectable } from '@angular/core';
import { url } from '../environment';
import { HttpClient } from '@angular/common/http';

enum Type {
  'attributes',
  'values',
}

export interface IAttributeFile {
  name: string;
  type: Type;
  user_id: number;
  sample_file: File;
}

@Injectable({
  providedIn: 'root',
})
export class AttributeFileService {
  api = url + 'attribute-file';
  attributeFile!: IAttributeFile[];
  constructor(private http: HttpClient) {}
  getAttribute() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.attributeFile = data as IAttributeFile[]));
    return this.attributeFile;
  }

  addAttribute(attributeFile: IAttributeFile) {
    this.http.post(this.api + '/', attributeFile);
  }

  updateAttribute(id: number, attributeFile: IAttributeFile) {
    this.http.patch(this.api + '/' + id.toString(), attributeFile);
  }

  deleteAttribute(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
