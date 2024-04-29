import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

export interface IMemory {
  input: string;
  output: string;
  user_id: number;
  field_of_activity: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  api = url.apiKey + 'memory';
  memory!: IMemory[];
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient) {}
  getMemory() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.memory = data as IMemory[]));
    return this.memory;
  }

  addMemory(memory: IMemory) {
    return this.http.post(this.api + '/', memory, { headers: this.headers });
  }

  updateMemory(id: number, memory: IMemory) {
    return this.http.patch(this.api + '/' + id.toString(), memory);
  }

  deleteMemory(id: number) {
    return this.http.delete(this.api + '/' + id.toString());
  }
}
