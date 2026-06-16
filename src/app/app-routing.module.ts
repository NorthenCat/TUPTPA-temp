import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './shared/templates/layout/layout.component';
import { PegawaiKKGuard,AdminGuard, AuthGuard, LoginGuard, RectorGuard, SuperadminGuard } from './_classes/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: { template: 'admin' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: './pages/_home/home.module#HomeModule',
        data: { animation: '1' }
      },
      {
        path: 'sample-page',
        loadChildren: './pages/sample-page/sample-page.module#SamplePageModule',
        data: { animation: '2' }
      },
      /*{
        path: 'admin-universitas',
        loadChildren: './pages/admin-universitas/admin-universitas.module#AdminUniversitasModule',
        data: { animation: '3' }
      },*/
      {
        path: 'vendor',
        loadChildren: './pages/vendor/vendor.module#AdminUniversitasModule',
        data: { animation: '4' }
      },
      {
        path: 'list-vendor',
        canActivate: [SuperadminGuard],
        loadChildren: './pages/list-vendor/list-vendor.module#ListVendorModule',
        data: { animation: '6' }
      }, 
      {
        path: 'manajemen-template',
        loadChildren: './pages/manajementemplate/manajemen-template.module#ManajemenTemplateModule',
        data: { animation: '7' }
      },
      {
        path: 'agenda-penilaian',
        loadChildren: './pages/agenda_penilaian/agenda-penilaian.module#AgendaPenilaianModule',
        data: { animation: '8' }
      },
      {
        path: 'detail-penilaian-pegawai',
        loadChildren: './pages/detail-penilaian-pegawai/detail-penilaian-pegawai.module#DetailPenilaianPegawaiModule',
        data: { animation: '9' }
      },
      {
        path: 'edit-penilaian-pegawai',
        loadChildren: './pages/edit-penilaian-pegawai/edit-penilaian-pegawai.module#EditPenilaianPegawaiModule',
        data: { animation: '10' }
      },
      {
        path: 'masukkan-nku',
        loadChildren: './pages/masukkan-nku/masukkan-nku.module#MasukkanNkuModule',
        data: { animation: '11' }
      },
      {
        path: 'pengaturan',
        loadChildren: './pages/pengaturan/pengaturan.module#PengaturanModule',
        data: { animation: '12' }
      },
      {
        path: 'sdm-penilai-satu',
        loadChildren: './pages/sdm-penilai-satu/sdm-penilai-satu.module#SdmPenilaiSatuModule',
        data: { animation: '13' }
      },
      {
        path: 'sdm-penilai-dua',
        loadChildren: './pages/sdm-penilai-dua/sdm-penilai-dua.module#SdmPenilaiDuaModule',
        data: { animation: '14' }
      },
      {
        path: 'penilai-satu-atasan-langsung',
        loadChildren: './pages/penilai-satu-atasan-langsung/penilai-satu-atasan-langsung.module#PenilaiSatuAtasanLangsungModule',
        data: { animation: '15' }
      },
      {
        path: 'penilai-dua-atasan-tidak-langsung',
        loadChildren: './pages/penilai-dua-atasan-tidak-langsung/penilai-dua-atasan-tidak-langsung.module#PenilaiDuaAtasanTidakLangsungModule',
        data: { animation: '16' }
      },
      {
        path: 'pegawai',
        canActivate: [PegawaiKKGuard],
        loadChildren: './pages/pegawai/pegawai.module#PegawaiModule',
        data: { animation: '17' }
      },
      {
        path: 'data-nki',
        loadChildren: './pages/data-nki/data-nki.module#DataNkiModule',
        data: { animation: '18' }
      },
      {
        path: 'rekap-performasi',
        loadChildren: './pages/rekap-performasi/rekap-performasi.module#RekapPerformasiModule'
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    data: { template: 'blank' },
    children: [
      {
        path: 'auth',
        canActivate: [LoginGuard],
        loadChildren: './pages/auth/authentication.module#AuthenticationModule'
      },
      {
        path: 'error',
        loadChildren: './pages/error/error.module#ErrorModule'
      }
    ]
  },
  {
    path: 'redirect',
    loadChildren: './pages/auth/redirect/redirect.module#RedirectModule'
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
