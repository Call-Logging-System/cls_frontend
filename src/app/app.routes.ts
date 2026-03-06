import { Routes } from '@angular/router';
import { AddCallLogForm } from './components/call-logs/add-call-log-form/add-call-log-form';
import { CallLogs } from './components/call-logs/call-logs';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'call-logs',
    pathMatch: 'full',
  },
  {
    path: 'call-logs',
    component: CallLogs,
  },
  {
    path: 'add-call-log',
    component: AddCallLogForm,
  },
];
