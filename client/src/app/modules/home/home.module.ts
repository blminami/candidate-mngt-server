import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home.routes';
import { AppMaterialModule } from '../app-material/app-material.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(HOME_ROUTES)
  ]
})
export class HomeModule { }
