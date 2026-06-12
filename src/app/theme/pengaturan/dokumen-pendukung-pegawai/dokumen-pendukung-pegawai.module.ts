import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DokumenPendukungPegawaiComponent } from './dokumen-pendukung-pegawai.component';
import { DokumenPendukungPegawaiRoutingModule } from './dokumen-pendukung-pegawai-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DokumenPendukungPegawaiComponent],
  imports: [
    CommonModule,
    DokumenPendukungPegawaiRoutingModule,
    SharedModule,
    DataTablesModule
  ]
})
export class DokumenPendukungPegawaiModule { }
