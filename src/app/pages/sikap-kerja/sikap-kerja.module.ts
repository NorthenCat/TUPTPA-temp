import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SikapKerjaComponent } from './sikap-kerja.component';
import { SikapKerjaRoutingModule } from './sikap-kerja-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SikapKerjaComponent],
  imports: [
    CommonModule,
    SikapKerjaRoutingModule,
    SharedModule
  ]
})
export class SikapKerjaModule { }
