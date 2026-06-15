import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PengaturanComponent } from './pengaturan.component';
import { PengaturanRoutingModule } from './pengaturan-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PengaturanComponent],
  imports: [
    CommonModule,
    PengaturanRoutingModule,
    SharedModule
  ]
})
export class PengaturanModule { }
