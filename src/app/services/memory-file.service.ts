import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';
import { Observable } from 'rxjs';

export interface IMemoryFile {
  name: string;
  memory_file: File;
  user: number;
  field_of_activity: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemoryFileService {
  api = url.apiKey + 'memory-file';
  memoryFile!: IMemoryFile[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getMemoryFile() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.memoryFile = data as IMemoryFile[]));
    return this.memoryFile;
  }

  addMemoryFile(memoryFile: FormData): Observable<IMemoryFile> {
    return this.http.post<IMemoryFile>(this.api + 's/', memoryFile, { headers: this.headers });
  }

  updateMemoryFile(id: number, memoryFile: IMemoryFile) {
    return this.http.patch(this.api + '/' + id.toString(), memoryFile);
  }

  deleteMemoryFile(id: number) {
    return this.http.delete(this.api + '/' + id.toString());
  }
}
