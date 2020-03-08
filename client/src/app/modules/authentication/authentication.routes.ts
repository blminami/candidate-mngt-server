import { LoginComponent } from './components/login/login.component';

export const AUTHENTICATION_ROUTES = [
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login', id: 'login' }
    },
];