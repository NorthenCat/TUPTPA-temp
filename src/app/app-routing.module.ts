import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './layout/auth/auth.component';
import { AdminComponent } from './layout/admin/admin.component';
import { PegawaiKKGuard,AdminGuard, AuthGuard, LoginGuard, RectorGuard, SuperadminGuard } from './_classes/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: './theme/_home/home.module#HomeModule',
        data: { animation: '1' }
      },
      {
        path: 'sample-page',
        loadChildren: './theme/sample-page/sample-page.module#SamplePageModule',
        data: { animation: '2' }
      },
      /*{
        path: 'admin-universitas',
        loadChildren: './theme/admin-universitas/admin-universitas.module#AdminUniversitasModule',
        data: { animation: '3' }
      },*/
      {
        path: 'vendor',
        loadChildren: './theme/vendor/vendor.module#AdminUniversitasModule',
        data: { animation: '4' }
      },
      {
        path: 'list-vendor',
        canActivate: [SuperadminGuard],
        loadChildren: './theme/list-vendor/list-vendor.module#ListVendorModule',
        data: { animation: '6' }
      }, 
      {
        path: 'manajemen-template',
        loadChildren: './theme/manajementemplate/manajemen-template.module#ManajemenTemplateModule',
        data: { animation: '7' }
      },
      {
        path: 'agenda-penilaian',
        loadChildren: './theme/agenda_penilaian/agenda-penilaian.module#AgendaPenilaianModule',
        data: { animation: '8' }
      },
      {
        path: 'detail-penilaian-pegawai',
        loadChildren: './theme/detail-penilaian-pegawai/detail-penilaian-pegawai.module#DetailPenilaianPegawaiModule',
        data: { animation: '9' }
      },
      {
        path: 'edit-penilaian-pegawai',
        loadChildren: './theme/edit-penilaian-pegawai/edit-penilaian-pegawai.module#EditPenilaianPegawaiModule',
        data: { animation: '10' }
      },
      {
        path: 'masukkan-nku',
        loadChildren: './theme/masukkan-nku/masukkan-nku.module#MasukkanNkuModule',
        data: { animation: '11' }
      },
      {
        path: 'pengaturan',
        loadChildren: './theme/pengaturan/pengaturan.module#PengaturanModule',
        data: { animation: '12' }
      },
      {
        path: 'sdm-penilai-satu',
        loadChildren: './theme/sdm-penilai-satu/sdm-penilai-satu.module#SdmPenilaiSatuModule',
        data: { animation: '13' }
      },
      {
        path: 'sdm-penilai-dua',
        loadChildren: './theme/sdm-penilai-dua/sdm-penilai-dua.module#SdmPenilaiDuaModule',
        data: { animation: '14' }
      },
      {
        path: 'penilai-satu-atasan-langsung',
        loadChildren: './theme/penilai-satu-atasan-langsung/penilai-satu-atasan-langsung.module#PenilaiSatuAtasanLangsungModule',
        data: { animation: '15' }
      },
      {
        path: 'penilai-dua-atasan-tidak-langsung',
        loadChildren: './theme/penilai-dua-atasan-tidak-langsung/penilai-dua-atasan-tidak-langsung.module#PenilaiDuaAtasanTidakLangsungModule',
        data: { animation: '16' }
      },
      {
        path: 'pegawai',
        canActivate: [PegawaiKKGuard],
        loadChildren: './theme/pegawai/pegawai.module#PegawaiModule',
        data: { animation: '17' }
      },
      {
        path: 'data-nki',
        loadChildren: './theme/data-nki/data-nki.module#DataNkiModule',
        data: { animation: '18' }
      },
      {
        path: 'rekap-performasi',
        loadChildren: './theme/rekap-performasi/rekap-performasi.module#RekapPerformasiModule'
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        canActivate: [LoginGuard],
        loadChildren: './theme/auth/authentication.module#AuthenticationModule'
      },
      {
        path: 'error',
        loadChildren: './theme/error/error.module#ErrorModule'
      }
    ]
  },
  {
    path: 'redirect',
    loadChildren: './theme/auth/redirect/redirect.module#RedirectModule'
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
