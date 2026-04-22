import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OfficeModel } from '../../models/office/office.model';

@Injectable({
  providedIn: 'root',
})
export class PhoneBookService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = `${environment.apiUrl}/api/phone_book/`;

  getOffices(): Observable<OfficeModel[]> {
    return this.http.get<OfficeModel[]>(this.baseUrl + 'offices');
  }

  getOfficeByUserName(userName: string): Observable<OfficeModel> {
    return this.http.post<OfficeModel>(this.baseUrl + 'getOfficeByUserName',  userName );
  }

  updateOffice(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'update', payload);
  }

  searchOffices(query: string): Observable<OfficeModel[]> {
    return this.http.post<OfficeModel[]>(this.baseUrl + 'searchOffice',  query );
  }
}
