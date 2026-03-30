import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhoneBookService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = 'http://localhost:8081/api/phone_book/';

  getOffices(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'offices');
  }

  getOfficeByUserName(userName: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'getOfficeByUserName', userName);
  }

  updateOffice(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'update', payload);
  }
}
