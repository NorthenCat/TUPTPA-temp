import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenComponent } from './403.component';
import { ForbiddenRoutingModule } from './403-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ForbiddenRoutingModule,
    SharedModule
  ],
  declarations: [ForbiddenComponent]
})
export class ForbiddenModule { }
