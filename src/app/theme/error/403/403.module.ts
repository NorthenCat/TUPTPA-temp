import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenComponent } from './403.component';
import { ForbiddenRoutingModule } from './403-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ForbiddenRoutingModule
  ],
  declarations: [ForbiddenComponent]
})
export class ForbiddenModule { }
