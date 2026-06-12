import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PengaturanComponent } from './pengaturan.component';

const routes: Routes = [
  {
    path: '',
    component: PengaturanComponent,
    children: [
      {
        path: '',
        redirectTo: 'manajemen-sumber-data',
        pathMatch: 'full'
      },
      {
        path: 'manajemen-sumber-data',
        loadChildren:
          './manajemen-sumber-data/manajemen-sumber-data.module#ManajemenSumberDataModule'
      },
      {
        path: 'manajemen-sumber-data/detail/:id',
        loadChildren:
          './manajemen-data-detail/manajemen-data-detail.module#ManajemenDataDetailModule'
      },
      {
        path: 'dokumen-pendukung-pegawai',
        loadChildren:
          './dokumen-pendukung-pegawai/dokumen-pendukung-pegawai.module#DokumenPendukungPegawaiModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PengaturanRoutingModule {}
