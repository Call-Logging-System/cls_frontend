import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CallLog } from '../../models/call-log/call-log.model';

@Injectable({
  providedIn: 'root',
})
export class CallLogService {
  readonly baseUrl = 'http://localhost:8081/api/call_logs/';

  constructor(private http: HttpClient) {}

  getCallLogs(): Observable<CallLog[]> {
    return this.http.get<CallLog[]>(this.baseUrl + 'getList');
  }

  saveOffice(payload: { userName: string; officeLevel: number | null }): Observable<any> {
    console.log('Saving office with payload:', payload);
    return this.http.post(this.baseUrl + 'office/save', payload);
  }
}
