// app.routes.ts
import { Routes } from '@angular/router';
import { AddCallLogForm } from './components/call-logs/add-call-log-form/add-call-log-form';
import { CallLogs } from './components/call-logs/call-logs';
import { EditCallLogForm } from './components/call-logs/edit-call-log-form/edit-call-log-form';
import { Login } from './components/login/login';
import { PhoneBook } from './components/phone-book/phone-book';
import { authGuard } from './services/auth/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'add-call-log',
    component: AddCallLogForm,
    canActivate: [authGuard],
  },
  { path: 'edit-call-log/:id', component: EditCallLogForm, canActivate: [authGuard] },
  {
    path: 'phone-book',
    component: PhoneBook,
    canActivate: [authGuard],
  },
];
