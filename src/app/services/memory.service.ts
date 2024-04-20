import { HttpClient } from '@angular/common/http';
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
  api = url + 'memory';
  memory!: IMemory[];
  constructor(private http: HttpClient) {}
  getMemory() {
    this.http
      .get(this.api)
      .subscribe((data) => (this.memory = data as IMemory[]));
    return this.memory;
  }

  addMemory(memory: IMemory) {
    this.http.post(this.api + '/', memory);
  }

  updateMemory(id: number, memory: IMemory) {
    this.http.patch(this.api + '/' + id.toString(), memory);
  }

  deleteMemory(id: number) {
    this.http.delete(this.api + '/' + id.toString());
  }
}
