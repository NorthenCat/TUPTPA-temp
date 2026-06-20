import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './404.component';
import { NotFoundRoutingModule } from './404-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    SharedModule
  ],
  declarations: [NotFoundComponent]
})
export class NotFoundModule { }
