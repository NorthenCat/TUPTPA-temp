import { NgModule } from '@angular/core';
import { TargetKinerjaPegawaiComponent } from './target-kinerja-pegawai.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TargetKinerjaPegawaiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetKinerjaPegawaiRoutingModule { }
