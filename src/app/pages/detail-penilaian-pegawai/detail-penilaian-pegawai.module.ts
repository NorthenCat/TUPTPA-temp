import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPenilaianPegawaiComponent } from './detail-penilaian-pegawai.component';
import { DetailPenilaianPegawaiRoutingModule } from './detail-penilaian-pegawai-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DetailPenilaianPegawaiComponent],
  imports: [
    CommonModule,
    DetailPenilaianPegawaiRoutingModule,
    SharedModule
  ]
})
export class DetailPenilaianPegawaiModule { }
