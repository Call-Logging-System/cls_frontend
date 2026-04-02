// app.routes.ts
import { Routes } from '@angular/router';
import { AddCallLogForm } from './components/call-logs/add-call-log-form/add-call-log-form';
import { CallLogs } from './components/call-logs/call-logs';
import { EditCallLogForm } from './components/call-logs/edit-call-log-form/edit-call-log-form';
import { Login } from './components/login/login';
import { PhoneBook } from './components/phone-book/phone-book';
import { User } from './components/user/user';
import { authGuard } from './services/auth/auth.guard';
import { ChangePassword } from './components/setting/change-password/change-password';

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
    canActivate: [authGuard],
    data: { roles: [1, 2] },
    children: [
      { path: '', component: CallLogs },
      { path: 'add', component: AddCallLogForm },
      { path: 'edit/:id', component: EditCallLogForm },
    ],
  },
  {
    path: 'phone-book',
    component: PhoneBook,
    canActivate: [authGuard],
    data: { roles: [1, 2] },
  },
  {
    path: 'user-management',
    component: User,
    canActivate: [authGuard],
    data: { roles: [1] },
  },
  {
    path: 'settings/change-password',
    component: ChangePassword,
    canActivate: [authGuard],
    data: { roles: [1, 2] },
  },
];
