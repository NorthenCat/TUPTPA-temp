import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RekapPerformasiComponent } from './rekap-performasi.component';
import { RekapPerformasiRoutingModule } from './rekap-performasi-routing.module';

@NgModule({
  declarations: [RekapPerformasiComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RekapPerformasiRoutingModule
  ]
})
export class RekapPerformasiModule { }
