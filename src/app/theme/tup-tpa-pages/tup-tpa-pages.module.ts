import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { DaftarDataPenilaianPegawaiComponent } from '../daftar-data-penilaian-pegawai/daftar-data-penilaian-pegawai.component';
import { TargetKinerjaPegawaiComponent } from '../target-kinerja-pegawai/target-kinerja-pegawai.component';
import { SikapKerjaComponent } from '../sikap-kerja/sikap-kerja.component';
import { InovasiPenghargaanKontribusiComponent } from '../inovasi-penghargaan-kontribusi/inovasi-penghargaan-kontribusi.component';

@NgModule({
  declarations: [
    DaftarDataPenilaianPegawaiComponent,
    TargetKinerjaPegawaiComponent,
    SikapKerjaComponent,
    InovasiPenghargaanKontribusiComponent
  ],
  imports: [
    CommonModule,
    RouterModule,          // penting kalau ada routerLink di html
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbDropdownModule
  ],
  exports: [
    DaftarDataPenilaianPegawaiComponent,
    TargetKinerjaPegawaiComponent,
    SikapKerjaComponent,
    InovasiPenghargaanKontribusiComponent
  ]
})
export class TupTpaPagesModule {}

//module untuk menampung module sdm penilai satu dan dua 