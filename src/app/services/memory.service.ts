import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

export interface IMemory {
  id?: number;
  input: string;
  output: string;
  user: number;
  field_of_activity: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  api = url.apiKey;
  memory!: IMemory[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getMemory() {
    return this.http
      .get(this.api + 'memories', {headers: this.headers})
  }

  addMemory(memory: IMemory) {
    return this.http.post(this.api + 'addmemory/', memory, { headers: this.headers });
  }

  updateMemory(id: number, memory: IMemory) {
    return this.http.patch(this.api + 'memory/' + id.toString(), memory);
  }

  deleteMemory(id: number) {
    return this.http.delete(this.api + 'delete-memory', {body: {'id':id.toString()}, headers: this.headers});
  }
}
