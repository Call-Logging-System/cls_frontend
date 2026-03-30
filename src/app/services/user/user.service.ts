import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SaveUserModel, UserModel } from '../../models/user/user.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = 'http://localhost:8081/api/user_management/';

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.baseUrl + 'users');
  }

  saveUser(payload: SaveUserModel): Observable<any> {
    return this.http.post(this.baseUrl + 'save', payload);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.post(this.baseUrl + 'delete', id);
  }

  updateUser(payload: UserModel): Observable<any> {
    return this.http.post(this.baseUrl + 'update', payload);
  }
}
