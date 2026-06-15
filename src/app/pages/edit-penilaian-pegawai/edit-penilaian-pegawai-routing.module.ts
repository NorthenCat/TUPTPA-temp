import { NgModule } from '@angular/core';
import { EditPenilaianPegawaiComponent } from './edit-penilaian-pegawai.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    component: EditPenilaianPegawaiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPenilaianPegawaiRoutingModule { }
