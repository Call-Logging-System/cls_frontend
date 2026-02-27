import { Routes } from '@angular/router';
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
];
