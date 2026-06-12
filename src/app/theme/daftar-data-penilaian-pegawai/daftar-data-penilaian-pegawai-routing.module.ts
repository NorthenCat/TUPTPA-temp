import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DaftarDataPenilaianPegawaiComponent } from './daftar-data-penilaian-pegawai.component';

const routes: Routes = [
  {
    path: ':assessorId/:periodId',
    component: DaftarDataPenilaianPegawaiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaftarDataPenilaianPegawaiRoutingModule { }