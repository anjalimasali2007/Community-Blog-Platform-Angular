import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private api = '/api/blogs'; 

  constructor(private http: HttpClient) {}

  list(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.api);
  }

  get(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.api}/${id}`);
  }

  create(payload: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.api, payload);
  }

  update(id: number, payload: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.api}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
