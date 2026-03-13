// app.routes.ts
import { Routes } from '@angular/router';
import { AddCallLogForm } from './components/call-logs/add-call-log-form/add-call-log-form';
import { CallLogs } from './components/call-logs/call-logs';
import { EditCallLogForm } from './components/call-logs/edit-call-log-form/edit-call-log-form';
import { PhoneBook } from './components/call-logs/phone-book/phone-book';
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
  { path: 'edit-call-log/:id', component: EditCallLogForm },
  {
    path: 'phone-book',
    component: PhoneBook,
  },
];
