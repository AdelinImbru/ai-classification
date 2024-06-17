import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {

  constructor(private http: HttpClient) { }
  api = url.apiKey;
  headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  query_text(text: string){
    console.log(this.headers)
    return this.http.post(this.api + 'query-text/', {"input": text}, {headers: this.headers})
  }

  query_file(files: FormData){
    return this.http.post(this.api + 'query-file/', files, {headers: this.headers})
  }
}
