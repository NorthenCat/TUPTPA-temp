import { NgModule } from '@angular/core';
import { DetailPenilaianPegawaiComponent } from './detail-penilaian-pegawai.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    component: DetailPenilaianPegawaiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailPenilaianPegawaiRoutingModule { }
