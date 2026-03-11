// app.routes.ts
import { Routes } from '@angular/router';
import { CallLogs } from './components/call-logs/call-logs';
import { AddCallLogForm } from './components/call-logs/add-call-log-form/add-call-log-form';
import { Login } from './components/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
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