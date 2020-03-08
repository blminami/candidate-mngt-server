import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AUTHENTICATION_ROUTES } from './authentication.routes';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(AUTHENTICATION_ROUTES)
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
