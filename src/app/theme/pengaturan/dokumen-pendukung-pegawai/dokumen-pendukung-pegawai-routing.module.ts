import { NgModule } from '@angular/core';
import { DokumenPendukungPegawaiComponent } from './dokumen-pendukung-pegawai.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DokumenPendukungPegawaiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DokumenPendukungPegawaiRoutingModule { }
