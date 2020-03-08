import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatButtonModule } from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule
  ]
})
export class AppMaterialModule { }
