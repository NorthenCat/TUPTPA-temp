import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenilaiSatuAtasanLangsungComponent } from './penilai-satu-atasan-langsung.component';
import { DaftarDataPenilaianPegawaiComponent } from '../daftar-data-penilaian-pegawai/daftar-data-penilaian-pegawai.component';
import { TargetKinerjaPegawaiComponent } from '../target-kinerja-pegawai/target-kinerja-pegawai.component';
import { SikapKerjaComponent } from '../sikap-kerja/sikap-kerja.component';
import { InovasiPenghargaanKontribusiComponent } from '../inovasi-penghargaan-kontribusi/inovasi-penghargaan-kontribusi.component';

const ROLE_CONTEXT = 'PENILAI1_ATASAN';

const routes: Routes = [
  {
    path: 'daftar-data-penilaian-pegawai/:assessorId/:periodId',
    component: DaftarDataPenilaianPegawaiComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/target-kinerja/:penilaianId',
    component: TargetKinerjaPegawaiComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/sikap-kerja/:penilaianId',
    component: SikapKerjaComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/ipk/:penilaianId',
    component: InovasiPenghargaanKontribusiComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: '',
    component: PenilaiSatuAtasanLangsungComponent,
    pathMatch: 'full',
    data: { roleContext: ROLE_CONTEXT }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenilaiSatuAtasanLangsungRoutingModule {}