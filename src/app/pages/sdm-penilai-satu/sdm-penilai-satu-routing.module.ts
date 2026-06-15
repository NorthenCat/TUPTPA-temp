import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SdmPenilaiSatuComponent } from './sdm-penilai-satu.component';
import { DaftarDataPenilaianPegawaiComponent } from '../daftar-data-penilaian-pegawai/daftar-data-penilaian-pegawai.component';
import { TargetKinerjaPegawaiComponent } from '../target-kinerja-pegawai/target-kinerja-pegawai.component';
import { SikapKerjaComponent } from '../sikap-kerja/sikap-kerja.component';
import { InovasiPenghargaanKontribusiComponent } from '../inovasi-penghargaan-kontribusi/inovasi-penghargaan-kontribusi.component';


const ROLE_CONTEXT = 'SDM_PENILAI1';
const routes: Routes = [
  {
    path: 'daftar-data-penilaian-pegawai/:assessorId/:periodId',
    component: DaftarDataPenilaianPegawaiComponent
  },
  {
    path: 'daftar-data-penilaian-pegawai/:id',
    component: DaftarDataPenilaianPegawaiComponent
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/target-kinerja/:penilaianId',
    component: TargetKinerjaPegawaiComponent,
    data: {
      roleContext: ROLE_CONTEXT
    }
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/sikap-kerja/:penilaianId',
    component: SikapKerjaComponent,
    data: {
      roleContext: ROLE_CONTEXT
    }
  },
  {
    path: 'daftar-data-penilaian-pegawai/:pegawaiId/ipk/:penilaianId',
    component: InovasiPenghargaanKontribusiComponent,
    data: {
      roleContext: ROLE_CONTEXT
    }
  },
  {
    path: '',
    component: SdmPenilaiSatuComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SdmPenilaiSatuRoutingModule { }
