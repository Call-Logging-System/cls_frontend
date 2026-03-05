import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CallLog } from '../../models/call-log/call-log.model';

@Injectable({
  providedIn: 'root',
})
export class CallLogService {
  readonly baseUrl = 'http://localhost:8081/api/';

  constructor(private http: HttpClient) {}

  getCallLogs(): Observable<CallLog[]> {
    return this.http.get<CallLog[]>(this.baseUrl + 'call_logs/getList');
  }
}
