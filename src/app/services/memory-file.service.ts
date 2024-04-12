import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

export interface IMemoryFile {
  name: string;
  memoryFile: File;
  user_id: number;
  field_of_activity: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemoryFileService {
  api = url + 'memory-file';
  memoryFile!: IMemoryFile[];
  constructor(private http: HttpClient) {}
  getMemoryFile() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.memoryFile = data as IMemoryFile[]));
    return this.memoryFile;
  }

  addMemoryFile(memoryFile: IMemoryFile) {
    this.http.post(this.api + '/', memoryFile);
  }

  updateMemoryFile(id: number, memoryFile: IMemoryFile) {
    this.http.patch(this.api + '/', memoryFile);
  }

  deleteMemoryFile(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
