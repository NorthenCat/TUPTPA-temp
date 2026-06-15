import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaftarDataPenilaianPegawaiComponent } from './daftar-data-penilaian-pegawai.component';
import { DaftarDataPenilaianPegawaiRoutingModule } from './daftar-data-penilaian-pegawai-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DaftarDataPenilaianPegawaiComponent],
  imports: [
    CommonModule,
    DaftarDataPenilaianPegawaiRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class DaftarDataPenilaianPegawaiModule { }
