import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PegawaiTargetKinerjaPegawaiComponent } from './target-kinerja-pegawai/target-kinerja-pegawai.component';
import { SikapKerjaComponent } from '../sikap-kerja/sikap-kerja.component';
import { InovasiPenghargaanKontribusiComponent } from '../inovasi-penghargaan-kontribusi/inovasi-penghargaan-kontribusi.component';

const ROLE_CONTEXT = 'PEGAWAI';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pegawai/target-kinerja/default',
    pathMatch: 'full'
  },
  {
    path: 'target-kinerja/:penilaianId',
    component: PegawaiTargetKinerjaPegawaiComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: 'sikap-kerja/:penilaianId',
    component: SikapKerjaComponent,
    data: { roleContext: ROLE_CONTEXT }
  },
  {
    path: 'ipk/:penilaianId',
    component: InovasiPenghargaanKontribusiComponent,
    data: { roleContext: ROLE_CONTEXT }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PegawaiRoutingModule { }
